import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useUserStore } from '../../stores/userStore';
import FirebaseSync from '../persistence/FirebaseSync';

export class AuthService {
  static init() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Read the "admin" custom claim from the ID token. This is the source
        // of truth for admin status — set server-side via scripts/set-admin.mjs
        // and enforced in Firestore security rules.
        let isAdmin = false;
        try {
          const token = await firebaseUser.getIdTokenResult();
          isAdmin = token.claims.admin === true;
        } catch (e) {
          console.error('Could not read auth claims:', e);
        }

        // User is signed in, update store
        const user = useUserStore.getState().user;
        useUserStore.getState().setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || user?.name || 'Explorer',
          email: firebaseUser.email || undefined,
          age: user?.age || 6,
          avatar: user?.avatar || 'ava',
          dailyGoal: user?.dailyGoal || 10,
          isGuest: false,
          isAdmin
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

  static async signUp(email: string, pass: string, name?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      // Save the chosen name so it shows up as the display name everywhere.
      if (name && name.trim()) {
        await updateProfile(result.user, { displayName: name.trim() });
        useUserStore.getState().setUser({
          ...(useUserStore.getState().user as any),
          id: result.user.uid,
          name: name.trim(),
          email: result.user.email || undefined,
          isGuest: false,
        });
      }
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
