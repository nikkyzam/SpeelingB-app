import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export class FirebaseSync {
  static async syncFromServer() {
    const user = auth.currentUser;
    // Don't sync for anonymous/guest users or if not logged in
    if (!user || user.isAnonymous) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.progress) {
          localStorage.setItem('learningProgress', JSON.stringify(data.progress));
        }
        if (data.userData) {
          const userStore = JSON.parse(localStorage.getItem('user-storage') || '{"state":{}}');
          userStore.state.user = data.userData;
          localStorage.setItem('user-storage', JSON.stringify(userStore));
        }
        if (data.rewards) {
          const rewardStore = { state: data.rewards, version: 0 };
          localStorage.setItem('reward-storage', JSON.stringify(rewardStore));
        }
        console.log('Firebase data synced from server');
        // Dispatch event before reload just in case, though reload is the main mechanism here
        window.dispatchEvent(new Event('learningProgressUpdated'));
        // Reload page to apply synced state to stores
        window.location.reload();
      }
    } catch (error) {
      console.error('Error syncing from Firebase:', error);
    }
  }

  static async syncToServer() {
    const user = auth.currentUser;
    // Don't sync for anonymous/guest users or if not logged in
    if (!user || user.isAnonymous) return;

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
