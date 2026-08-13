import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

const SYNC_FLAG_PREFIX = 'fb-synced:';

/**
 * The uid whose saved data we have already pulled down in this page session.
 * Uploads are BLOCKED until this matches the signed-in user, otherwise a fresh
 * login (whose localStorage was cleared on logout) would push empty progress
 * and wipe the studied words stored on the server.
 */
let hydratedUid: string | null = null;

export class FirebaseSync {
  /** Forget hydration + per-session sync flags (called on logout). */
  static resetHydration() {
    hydratedUid = null;
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(SYNC_FLAG_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
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

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      sessionStorage.setItem(flag, '1'); // mark before any reload
      hydratedUid = user.uid; // safe to upload from here on

      if (docSnap.exists()) {
        const data = docSnap.data();
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
          if (JSON.stringify(userStore.state?.user) !== JSON.stringify(data.userData)) {
            userStore.state = userStore.state || {};
            userStore.state.user = data.userData;
            localStorage.setItem('user-storage', JSON.stringify(userStore));
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

        console.log('Firebase data synced from server', changed ? '(applying)' : '(no change)');
        // Only reload when the server actually had newer data — and thanks to
        // the session flag above, at most once.
        if (changed) {
          window.dispatchEvent(new Event('learningProgressUpdated'));
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error syncing from Firebase:', error);
    }
  }

  static async syncToServer() {
    const user = auth.currentUser;
    // Don't sync for anonymous/guest users or if not logged in
    if (!user || user.isAnonymous) return;

    // Never upload before we've pulled this user's saved data down, or we would
    // overwrite their studied words with a blank local state after a logout.
    if (hydratedUid !== user.uid) return;

    try {
      const progress = localStorage.getItem('learningProgress');
      const userStore = JSON.parse(localStorage.getItem('user-storage') || '{}');
      const rewardStore = JSON.parse(localStorage.getItem('reward-storage') || '{}');
      
      const syncData: any = {
        lastUpdated: new Date().toISOString()
      };

      if (progress) syncData.progress = JSON.parse(progress);
      if (userStore.state?.user) syncData.userData = userStore.state.user;
      if (rewardStore.state) syncData.rewards = rewardStore.state;

      await setDoc(doc(db, 'users', user.uid), syncData, { merge: true });
      console.log('Firebase data synced to server');
    } catch (error) {
      console.error('Error syncing to Firebase:', error);
    }
  }
}

export default FirebaseSync
