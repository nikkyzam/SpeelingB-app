import React, { useState } from 'react';
import AuthService from '../../services/auth/AuthService';
import Button from '../common/Button';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Turn raw Firebase auth errors into friendly, plain-language messages. */
const friendlyError = (err: any): string => {
  const code: string = err?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email already has an account. Try logging in instead. 🙂';
    case 'auth/invalid-email':
      return 'Hmm, that email doesn\'t look right. Please check it.';
    case 'auth/weak-password':
      return 'Please pick a password with at least 6 characters.';
    case 'auth/missing-password':
      return 'Please enter a password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Wrong email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many tries — please wait a minute and try again.';
    case 'auth/network-request-failed':
      return 'Network problem. Please check your internet and try again.';
    case 'auth/operation-not-allowed':
      return 'Email sign-up isn\'t turned on yet for this app. Ask the grown-up who set it up to enable Email/Password sign-in in Firebase.';
    default:
      return err?.message?.replace('Firebase: ', '') || 'Something went wrong. Please try again.';
  }
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setConfirm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side checks give instant, friendly feedback before hitting Firebase.
    if (!isLogin) {
      if (password.length < 6) {
        setError('Please pick a password with at least 6 characters.');
        return;
      }
      if (password !== confirm) {
        setError('The two passwords don\'t match. Please try again.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await AuthService.login(email, password);
      } else {
        await AuthService.signUp(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">×</button>
        <h2>{isLogin ? 'Welcome Back! 👋' : 'Create Your Account! 🚀'}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Log in to save your stars and streaks.'
            : 'Make an account so your progress is saved on any device.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ava"
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {!isLogin && <span className="field-hint">At least 6 characters</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Please wait…' : (isLogin ? 'Log In' : 'Create Account')}
          </Button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "New here?" : 'Already have an account?'}
            <button type="button" onClick={switchMode}>
              {isLogin ? 'Create an account' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
