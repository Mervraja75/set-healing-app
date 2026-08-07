// =======================================
// SCREEN: AdminLogin (src/components/AdminLogin.tsx)
// Purpose: Admin sign-in
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { GOLD, goldAlpha } from '../theme/colors';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#0A0616',
  bgCardDeep:   '#250D3D',
  bgHero:       '#2D0F50',

  goldBright:   GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#9683BE',

  borderGold:   goldAlpha(0.18),
  borderInput:  'rgba(180, 140, 255, 0.20)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.15)',

  errorBg:      'rgba(255, 80, 80, 0.08)',
  errorBorder:  'rgba(255, 80, 80, 0.25)',
  errorText:    '#FF8080',

  shadowCard: '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 10, letterSpacing: 3,
  textTransform: 'uppercase',
  color: C.textMuted, fontWeight: 500,
};

const fieldInputStyle: React.CSSProperties = {
  display: 'block', width: '100%',
  padding: '13px 16px',
  background: C.bgHero,
  border: `1px solid ${C.borderInput}`,
  borderRadius: 12,
  color: C.textBright,
  fontSize: 14, fontWeight: 300,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

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
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Jost', 'Inter', system-ui, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: -100, right: -100,
        width: 360, height: 360, borderRadius: '50%',
        background: C.glowGold, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: C.glowPurple, pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: C.bgCardDeep,
        border: `1px solid ${C.borderGold}`,
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: C.shadowCard,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}>

        {/* Card inner glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: goldAlpha(0.06), pointerEvents: 'none',
        }} />

        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: 30, position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56,
            background: goldAlpha(0.10),
            border: `1px solid ${C.borderGold}`,
            borderRadius: 16,
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: 22, fontWeight: 800,
              color: C.goldBright, letterSpacing: -1,
            }}>SET</span>
          </div>
          <p style={{
            margin: '0 0 6px',
            fontSize: 10, letterSpacing: 3,
            textTransform: 'uppercase',
            color: C.textDim, fontWeight: 600,
          }}>Admin Panel</p>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: C.textBright, letterSpacing: -0.3,
          }}>Sign in</h1>
          <p style={{
            margin: '8px 0 0', fontSize: 13,
            color: C.textMid, fontWeight: 300,
          }}>Manage tracks and categories</p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold, marginBottom: 24,
        }} />

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 20, padding: '12px 16px',
            background: C.errorBg,
            border: `1px solid ${C.errorBorder}`,
            borderRadius: 12,
            color: C.errorText, fontSize: 13,
          }}>
            ⚠  {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={fieldLabelStyle}>Email</span>
            <input
              className="sh-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              style={fieldInputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={fieldLabelStyle}>Password</span>
            <input
              className="sh-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={fieldInputStyle}
            />
          </label>

          <button
            type="submit"
            className="sh-btn sh-btn-primary"
            disabled={loading}
            style={{
              marginTop: 6,
              width: '100%',
              padding: '15px 24px',
              background: loading ? goldAlpha(0.4) : C.goldBright,
              color: C.bg,
              border: 'none',
              borderRadius: 99,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(215,136,42,0.22)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 11, color: C.textDim }}>
            Sign in with your SET Healing admin account
          </p>
        </div>
      </div>
    </div>
  );
}
