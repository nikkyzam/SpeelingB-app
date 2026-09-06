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

/**
 * A friendly first name from an email address, for accounts that never set a
 * display name: "sam.smith@x.com" -> "Sam".
 */
const nameFromEmail = (email?: string | null): string | undefined => {
  const local = (email || '').split('@')[0];
  const first = local.split(/[._\-+0-9]/).filter(Boolean)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : undefined;
};

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

        // User is signed in, update store.
        const previous = useUserStore.getState().user;
        // Only carry details forward when they already belong to THIS account.
        // The old code fell back to `user?.name`, which was the guest default —
        // so signing in as anyone kept showing the guest's name ("Ava") unless
        // the Firebase account happened to have a displayName set.
        const sameAccount = !!previous && !previous.isGuest && previous.id === firebaseUser.uid;

        useUserStore.getState().setUser({
          id: firebaseUser.uid,
          name:
            firebaseUser.displayName?.trim() ||
            (sameAccount ? previous!.name : undefined) ||
            nameFromEmail(firebaseUser.email) ||
            'Explorer',
          email: firebaseUser.email || undefined,
          age: sameAccount ? previous!.age : 6,
          avatar: sameAccount ? previous!.avatar : '🧒',
          dailyGoal: sameAccount ? previous!.dailyGoal : 5,
          isGuest: false,
          isAdmin
        });
        // Pull the saved progress down FIRST. Uploads are blocked until this
        // finishes, so a fresh login can never overwrite the studied words.
        FirebaseSync.syncFromServer();
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

  /**
   * Rename the signed-in account so the new name survives a re-login (the
   * store alone would be overwritten from the Firebase profile next time).
   * Safe to call when signed out — it just does nothing.
   */
  static async updateDisplayName(name: string): Promise<void> {
    const current = auth.currentUser;
    if (!current || !name.trim()) return;
    await updateProfile(current, { displayName: name.trim() });
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
      // The auth listener can reach syncFromServer before updateProfile has
      // set the display name, so pass the chosen name in explicitly.
      await FirebaseSync.ensureUserDocument(name?.trim());
      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      // Make sure the latest progress is safely on the server before we clear
      // the local copy, then forget hydration so the next login re-pulls it.
      await FirebaseSync.syncToServer().catch(() => {})
      await signOut(auth);
      FirebaseSync.resetHydration();
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
