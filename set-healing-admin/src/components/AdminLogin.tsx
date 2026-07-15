// src/components/AdminLogin.tsx
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../services/firebase';

type Props = {
  onLogin: () => void;
};

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Please provide email and password.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <h1 className="brand">SET Healing App — Admin</h1>
        <p className="muted">Sign in to manage tracks and categories</p>

        <form onSubmit={handleSubmit} className="form">
          {error && <div className="error">{error}</div>}

          <label className="label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </label>

          <label className="label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="help-row">
          <small className="muted">Sign in with your SET Healing admin account</small>
        </div>
      </div>
    </div>
  );
}
