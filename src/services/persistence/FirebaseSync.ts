import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { withoutAdminClaim, withAdminClaimDenied } from '../auth/adminClaim';
import { BUNDLED_SYNC_KEYS, prepareDeviceFor } from './userKeys';

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

    // Guard against an infinite reload loop: syncing applies data by reloading
    // the page, which re-fires the auth listener. Only run once per session per
    // user so the reload can't chain forever.
    const flag = `${SYNC_FLAG_PREFIX}${user.uid}`;
    if (sessionStorage.getItem(flag)) {
      // Already pulled earlier in this session (e.g. before a reload) — the
      // local copy is authoritative, so allow uploads again.
      hydratedUid = user.uid;
      return;
    }

    // If a different account used this device last, everything of theirs goes
    // before this child's data is pulled down. This is what stops one child's
    // buddy, stars and world from greeting the next child to sign in.
    if (prepareDeviceFor(user.uid)) {
      console.log('Firebase sync: different account than last time — cleared local data');
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      sessionStorage.setItem(flag, '1'); // mark before any reload
      hydratedUid = user.uid; // safe to upload from here on

      if (docSnap.exists()) {
        const data = docSnap.data();

        // A grown-up removed this child. Take the data off this device and sign
        // them out — otherwise the next upload would put it all back.
        if (data.deleted) {
          removedUid = user.uid;
          await FirebaseSync.wipeDevice();
          return;
        }

        let changed = false;

        if (data.progress) {
          const next = JSON.stringify(data.progress);
          if (localStorage.getItem('learningProgress') !== next) {
            localStorage.setItem('learningProgress', next);
            changed = true;
          }
        }
        if (data.userData) {
          const userStore = JSON.parse(localStorage.getItem('user-storage') || '{"state":{}}');
          // Anyone may write their own user document, so a saved `isAdmin` is
          // self-declared. AuthService puts the real claim back from the token.
          const incoming = withAdminClaimDenied(data.userData);
          if (JSON.stringify(userStore.state?.user) !== JSON.stringify(incoming)) {
            userStore.state = userStore.state || {};
            userStore.state.user = incoming;
            localStorage.setItem('user-storage', JSON.stringify(userStore));
            changed = true;
          }
        }
        if (data.points) {
          // Stars buy real-world rewards, so a grown-up may correct the balance
          // from the admin console — the server's copy wins on the way in.
          const next = JSON.stringify(data.points);
          if (localStorage.getItem('kids_spelling_points') !== next) {
            localStorage.setItem('kids_spelling_points', next);
            changed = true;
          }
        }
        if (data.rewards) {
          const next = JSON.stringify({ state: data.rewards, version: 0 });
          if (localStorage.getItem('reward-storage') !== next) {
            localStorage.setItem('reward-storage', next);
            changed = true;
          }
        }
        // Everything else that is the child's — buddy, badges, review schedule,
        // high scores — travels as one bundle of raw strings. The server's copy
        // wins for any key it has; keys it lacks are left alone, because the
        // device may simply be ahead of the last upload.
        if (data.local && typeof data.local === 'object') {
          for (const key of BUNDLED_SYNC_KEYS) {
            const value = (data.local as Record<string, unknown>)[key];
            if (typeof value === 'string' && localStorage.getItem(key) !== value) {
              localStorage.setItem(key, value);
              changed = true;
            }
          }
        }

        console.log('Firebase data synced from server', changed ? '(applying)' : '(no change)');
        // Only reload when the server actually had newer data — and thanks to
        // the session flag above, at most once.
        if (changed) {
          window.dispatchEvent(new Event('learningProgressUpdated'));
          window.location.reload();
        }
      } else {
        // First time we have seen this account: give them a document so a
        // grown-up can find them before they have learned anything.
        await FirebaseSync.ensureUserDocument();
      }
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

  static async syncToServer() {
    const user = auth.currentUser;
    // Don't sync for anonymous/guest users or if not logged in
    if (!user || user.isAnonymous) return;

    // Never upload before we've pulled this user's saved data down, or we would
    // overwrite their studied words with a blank local state after a logout.
    if (hydratedUid !== user.uid) return;

    // A removed account must never write anything back.
    if (removedUid === user.uid) return;

    try {
      const progress = localStorage.getItem('learningProgress');
      const userStore = JSON.parse(localStorage.getItem('user-storage') || '{}');
      const rewardStore = JSON.parse(localStorage.getItem('reward-storage') || '{}');
      
      const syncData: any = {
        lastUpdated: new Date().toISOString()
      };

      if (progress) syncData.progress = JSON.parse(progress);
      // Strip the admin claim on the way up: uploading it would let a forged
      // flag persist to the server and come back on the next device.
      if (userStore.state?.user) syncData.userData = withoutAdminClaim(userStore.state.user);
      if (rewardStore.state) syncData.rewards = rewardStore.state;
      const points = localStorage.getItem('kids_spelling_points');
      if (points) syncData.points = JSON.parse(points);

      const local: Record<string, string> = {};
      for (const key of BUNDLED_SYNC_KEYS) {
        const value = localStorage.getItem(key);
        if (value !== null) local[key] = value;
      }
      syncData.local = local;

      await setDoc(doc(db, 'users', user.uid), syncData, { merge: true });
      console.log('Firebase data synced to server');
    } catch (error) {
      console.error('Error syncing to Firebase:', error);
    }
  }
}

export default FirebaseSync
