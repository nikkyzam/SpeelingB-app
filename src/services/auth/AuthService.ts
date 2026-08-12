import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useUserStore } from '../../stores/userStore';
import FirebaseSync from '../persistence/FirebaseSync';

export class AuthService {
  static init() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, update store
        const user = useUserStore.getState().user;
        useUserStore.getState().setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || user?.name || 'Explorer',
          email: firebaseUser.email || undefined,
          age: user?.age || 6,
          avatar: user?.avatar || 'ava',
          dailyGoal: user?.dailyGoal || 10,
          isGuest: false
        });
        // Sync to server after potential local changes
        FirebaseSync.syncToServer();
      } else {
        // User is signed out, but we might want to keep the guest user or set to null
        // For now, let's keep it simple
      }
    });
  }

  static async login(email: string, pass: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async signUp(email: string, pass: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await signOut(auth);
      useUserStore.getState().logout();
      // Clear all persistent stores and data
      localStorage.removeItem('user');
      localStorage.removeItem('user-storage');
      localStorage.removeItem('progress-storage');
      localStorage.removeItem('reward-storage');
      localStorage.removeItem('learningProgress');
      localStorage.removeItem('kids_spelling_points');
      localStorage.removeItem('kids_spelling_purchase_history');
      localStorage.removeItem('kids_spelling_streak');
      localStorage.removeItem('streak');
      localStorage.removeItem('streak-storage');
      localStorage.removeItem('lastDailyReset');
      localStorage.removeItem('theme');
      
      // Force reload to reset all providers and states
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

export default AuthService;
