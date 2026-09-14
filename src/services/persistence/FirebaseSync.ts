import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { withoutAdminClaim, withAdminClaimDenied } from '../auth/adminClaim';
import { BUNDLED_SYNC_KEYS, prepareDeviceFor } from './userKeys';

import { equalSyncData, mergeSync } from './mergeSync';

const SYNC_FLAG_PREFIX = 'fb-synced:';

/**
 * The uid whose saved data we have already pulled down in this page session.
 * Uploads are BLOCKED until this matches the signed-in user, otherwise a fresh
 * login (whose localStorage was cleared on logout) would push empty progress
 * and wipe the studied words stored on the server.
 */
let hydratedUid: string | null = null;

/**
 * Set when the server says this account has been removed. Uploads are refused
 * from that moment on, so a device that was mid-session cannot push its local
 * copy back and resurrect the child.
 */
let removedUid: string | null = null;

let syncTimer: number | null = null;
let baseline: Record<string, any> = {};
let uploadQueue: Promise<void> = Promise.resolve();

const syncFields = (data: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const key of ['progress', 'userData', 'points', 'rewards', 'local']) {
    if (data[key] !== undefined) out[key] = data[key];
  }
  return out;
};
const localSnapshot = (): Record<string, any> => {
  const out: Record<string, any> = {};
  const read = (key: string) => JSON.parse(localStorage.getItem(key) || 'null');
  const progress = read('learningProgress');
  const user = read('user-storage')?.state?.user;
  const rewards = read('reward-storage')?.state;
  const points = read('kids_spelling_points');
  if (progress) out.progress = progress;
  if (user) out.userData = withoutAdminClaim(user);
  if (rewards) out.rewards = rewards;
  if (points) out.points = points;
  out.local = {};
  for (const key of BUNDLED_SYNC_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) out.local[key] = value;
  }
  return out;
};

/** Apply server changes before reloading providers that cache local storage. */
const applySnapshot = (data: Record<string, any>): boolean => {
  let changed = false;
  const put = (key: string, value: string) => {
    if (localStorage.getItem(key) !== value) {
      localStorage.setItem(key, value);
      changed = true;
    }
  };
  if (data.progress) put('learningProgress', JSON.stringify(data.progress));
  if (data.userData) {
    const saved = JSON.parse(localStorage.getItem('user-storage') || '{"state":{}}');
    saved.state = { ...saved.state, user: withAdminClaimDenied(data.userData) };
    put('user-storage', JSON.stringify(saved));
  }
  if (data.points) put('kids_spelling_points', JSON.stringify(data.points));
  if (data.rewards) put('reward-storage', JSON.stringify({ state: data.rewards, version: 0 }));
  for (const key of BUNDLED_SYNC_KEYS) {
    if (typeof data.local?.[key] === 'string') put(key, data.local[key]);
    else if (localStorage.getItem(key) !== null) { localStorage.removeItem(key); changed = true; }
  }
  return changed;
};
const remember = (uid: string, data: Record<string, any>) => {
  baseline = data;
  sessionStorage.setItem(`${SYNC_FLAG_PREFIX}${uid}`, JSON.stringify(data));
};

/** Per-child state that changes outside a progress save. */
const CHANGE_EVENTS = [
  'buddyUpdated',
  'wordMasteryUpdated',
  'reviewScheduleUpdated',
  'mysteryBoxUpdated',
  'gameStatsUpdated',
  'pointsEarned',
  'badgeUnlocked',
  'rewardPurchased',
  'streakUpdated',
];
if (typeof window !== 'undefined') {
  for (const name of CHANGE_EVENTS) {
    window.addEventListener(name, () => FirebaseSync.syncSoon());
  }
}

export class FirebaseSync {
  /** Forget hydration + per-session sync flags (called on logout). */
  static resetHydration() {
    hydratedUid = null;
    removedUid = null;
    baseline = {};
    if (syncTimer !== null) window.clearTimeout(syncTimer);
    syncTimer = null;
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(SYNC_FLAG_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  }

  /**
   * Make sure this child has a document, even before they have done anything.
   *
   * The grown-up console lists the `users` collection, so a child with no
   * document simply is not there — pressing Refresh could never find them. The
   * document used to be created only by the first progress save, which meant a
   * child who signed up and handed the tablet back was invisible to their
   * parent.
   *
   * Pass `name` from sign-up: the auth listener can reach here before
   * updateProfile has set the display name.
   */
  static async ensureUserDocument(name?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) return;

    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      // A removed child stays removed — never rebuild their document.
      if ((snap.data() as any)?.deleted) return;
      // Already there, and no new name to record.
      if (snap.exists() && !name) return;

      const identity: Record<string, unknown> = { id: user.uid };
      const chosen = name?.trim() || user.displayName?.trim();
      if (chosen) identity.name = chosen;
      if (user.email) identity.email = user.email;

      await setDoc(
        ref,
        { userData: identity, lastUpdated: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      console.error('Could not create the user document:', error);
    }
  }

  static async syncFromServer() {
    const user = auth.currentUser;
    // Don't sync for anonymous/guest users or if not logged in
    if (!user || user.isAnonymous) return;

    // Always check the server, including after refresh. The saved snapshot
    // distinguishes a reload from a new remote edit without suppressing reads.
    const flag = `${SYNC_FLAG_PREFIX}${user.uid}`;
    const switched = prepareDeviceFor(user.uid);
    let previous: Record<string, any> | undefined;
    try {
      const saved = sessionStorage.getItem(flag);
      if (!switched && saved && saved !== '1') previous = JSON.parse(saved);
    } catch { /* an older session has no usable baseline */ }
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (auth.currentUser?.uid !== user.uid) return;
      const data = snap.data() || {};
      if (data.deleted) {
        removedUid = user.uid;
        await FirebaseSync.wipeDevice();
        return;
      }
      const remote = syncFields(data);
      const local = localSnapshot();
      const incoming = previous ? mergeSync(previous, local, remote)
        : { ...local, ...remote, local: { ...local.local, ...remote.local } };
      remember(user.uid, remote);
      hydratedUid = user.uid;
      const changed = !equalSyncData(local, incoming) && applySnapshot(incoming);
      if (switched || changed) {
        window.dispatchEvent(new Event('learningProgressUpdated'));
        window.location.reload();
      }
      if (!snap.exists()) await FirebaseSync.ensureUserDocument();
    } catch (error) {
      console.error('Error syncing from Firebase:', error);
    }
  }

  /**
   * Clear this device of the signed-in child completely and send them back to
   * the start. Used when the account has been removed: unlike logout, which
   * keeps device preferences, this leaves nothing behind for the next person
   * to inherit.
   */
  static async wipeDevice() {
    try {
      await signOut(auth);
    } catch {
      // Signing out can fail offline; the local wipe still matters.
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

  /**
   * Upload shortly after the child's data changes.
   *
   * Progress saves already trigger an upload, but feeding the buddy, naming
   * it, or unlocking a badge did not — so a buddy named on one tablet was
   * simply missing on the next. Every per-child event now schedules one,
   * coalesced so a burst of taps is a single write.
   */
  static syncSoon(delayMs = 1500) {
    if (syncTimer !== null) window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => {
      syncTimer = null;
      FirebaseSync.syncToServer();
    }, delayMs);
  }

  static syncToServer(): Promise<void> {
    const uid = auth.currentUser?.uid;
    // Serialize saves so each transaction uses the previous save's baseline.
    const next = uploadQueue.then(() => FirebaseSync.upload(uid));
    uploadQueue = next.catch(() => {});
    return next;
  }

  private static async upload(uid: string | undefined): Promise<void> {
    const user = auth.currentUser;
    if (!user || user.isAnonymous || user.uid !== uid || hydratedUid !== uid || removedUid === uid) return;
    try {
      const local = localSnapshot();
      const base = baseline;
      const ref = doc(db, 'users', user.uid);
      const result = await runTransaction(db, async transaction => {
        const snap = await transaction.get(ref);
        const data = snap.data() || {};
        if (data.deleted) return null;
        if (auth.currentUser?.uid !== uid) throw new Error('Account changed during sync');
        const remote = syncFields(data);
        const merged = mergeSync(base, local, remote);
        const payload = { ...merged, lastUpdated: new Date().toISOString() };
        // Replace only these top-level maps, retaining admin metadata. Missing
        // entries inside a map must not survive as stale merged fields.
        transaction.set(ref, payload, { mergeFields: Object.keys(payload) });
        return merged;
      });
      if (auth.currentUser?.uid !== uid) return;
      if (result === null) {
        removedUid = user.uid;
        await FirebaseSync.wipeDevice();
        return;
      }
      remember(user.uid, result);
      // Preserve activity that happened while the request was in flight.
      const current = localSnapshot();
      const reconciled = mergeSync(local, current, result);
      if (!equalSyncData(current, reconciled) && applySnapshot(reconciled)) {
        window.dispatchEvent(new Event('learningProgressUpdated'));
        window.location.reload();
      }
    } catch (error) {
      console.error('Error syncing to Firebase:', error);
    }
  }
}

export default FirebaseSync
