import React, { useState } from 'react';
import AuthService from '../../services/auth/AuthService';
import Button from '../common/Button';
import './AuthModal.css';
import Dialog from '../common/Dialog';

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
      return 'Email sign-up isn\'t turned on yet for this app. Ask the person who set up the app for help.';
    default:
      return 'We could not sign in. Please try again with your grown-up.';
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
    <Dialog title="Save family progress" onClose={onClose}>
      <div className="auth-modal-content">
        <h2>{isLogin ? 'Grown-up sign in' : 'Save your child’s progress'}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Grown-ups: sign in to save learning progress across devices.'
            : 'Use a grown-up email. A child’s nickname is enough. Guest progress stays in this browser until you sign in.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Child’s nickname</label>
              <input
                id="auth-name" type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Ava"
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Grown-up email</label>
            <input
              id="auth-email" type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password" type="password"
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
              <label htmlFor="auth-confirm">Enter password again</label>
              <input
                id="auth-confirm" type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}

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
        <button className="comfort-button" onClick={onClose}>Keep playing as a guest</button>
      </div>
    </Dialog>
  );
};

export default AuthModal;
