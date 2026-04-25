// =======================================
// SCREEN: Dashboard (src/pages/Dashboard.tsx)
// Purpose: Admin control centre
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useState } from 'react';
import UploadTrack from './UploadTrack';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#120828',
  bgCard:       '#1E0A30',
  bgCardDeep:   '#250D3D',
  bgHero:       '#2D0F50',

  goldBright:   '#D4A828',
  goldMid:      '#C8920A',

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   'rgba(212, 168, 40, 0.18)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     'rgba(212, 168, 40, 0.08)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',

  aurora:       '#7EFFD4',
};

/* ---------------------------------------
   STAT CARD
---------------------------------------- */
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div style={{
      background: C.bgCardDeep,
      border: `1px solid ${C.borderGold}`,
      borderRadius: 16,
      padding: '20px 22px',
      flex: 1,
      minWidth: 140,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gold top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: C.goldBright, opacity: 0.4,
      }} />
      <p style={{
        margin: '0 0 6px',
        fontSize: 9,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: C.textDim,
        fontWeight: 400,
      }}>{label}</p>
      <p style={{
        margin: '0 0 4px',
        fontSize: 28,
        fontWeight: 700,
        color: C.goldBright,
        letterSpacing: -0.5,
      }}>{value}</p>
      {sub && (
        <p style={{
          margin: 0,
          fontSize: 11,
          color: C.textMuted,
          fontWeight: 300,
        }}>{sub}</p>
      )}
    </div>
  );
}

/* ---------------------------------------
   NAV ITEM
---------------------------------------- */
function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '11px 14px',
        borderRadius: 12,
        border: active ? `1px solid ${C.borderGold}` : '1px solid transparent',
        background: active ? 'rgba(212,168,40,0.08)' : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        marginBottom: 4,
      }}
    >
      <span style={{ fontSize: 16, color: active ? C.goldBright : C.textDim }}>
        {icon}
      </span>
      <span style={{
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        color: active ? C.textBright : C.textDim,
        letterSpacing: 0.3,
      }}>{label}</span>
    </button>
  );
}

/* ---------------------------------------
   MAIN COMPONENT
---------------------------------------- */
export default function Dashboard() {
  const [view, setView] = useState<'home' | 'upload' | string>('home');

  if (view === 'upload') {
    return <UploadTrack />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      fontFamily: "'Jost', 'Inter', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: C.glowGold, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -80, left: -80,
        width: 320, height: 320, borderRadius: '50%',
        background: C.glowPurple, pointerEvents: 'none',
      }} />

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: C.bgCard,
        borderRight: `1px solid ${C.borderGold}`,
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 28, paddingLeft: 4 }}>
          <p style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: C.goldBright,
            letterSpacing: -1,
            lineHeight: 1,
          }}>SET</p>
          <p style={{
            margin: 0,
            fontSize: 9,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: C.textDim,
            fontWeight: 300,
          }}>Admin Panel</p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold, marginBottom: 16,
        }} />

        {/* Nav items */}
        <NavItem icon="◉" label="Dashboard"    active={view === 'home'}   onClick={() => setView('home')} />
        <NavItem icon="◈" label="Upload Track" active={view === 'upload'} onClick={() => setView('upload')} />
        <NavItem icon="◎" label="Tracks"       />
        <NavItem icon="◐" label="Users"        />
        <NavItem icon="◆" label="Analytics"    />
        <NavItem icon="○" label="Settings"     />

        {/* Bottom status */}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 12px',
            background: 'rgba(126,255,212,0.06)',
            border: '1px solid rgba(126,255,212,0.15)',
            borderRadius: 99,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: C.aurora,
            }} />
            <span style={{
              fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase',
              color: C.aurora, fontWeight: 500,
            }}>System online</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        padding: '40px 36px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            margin: '0 0 6px',
            fontSize: 9, letterSpacing: 5,
            textTransform: 'uppercase',
            color: C.textDim, fontWeight: 300,
          }}>Control Centre</p>
          <h1 style={{
            margin: '0 0 6px',
            fontSize: 32, fontWeight: 700,
            color: C.textBright, letterSpacing: -0.5,
          }}>Dashboard</h1>
          <p style={{
            margin: 0, fontSize: 13,
            color: C.textMid, fontWeight: 300,
          }}>Manage your SET Healing platform</p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold,
          marginBottom: 32,
        }} />

        {/* Stat cards */}
        <div style={{
          display: 'flex', gap: 14, marginBottom: 36,
          flexWrap: 'wrap',
        }}>
          <StatCard label="Total Tracks"   value="—"  sub="Tracks uploaded" />
          <StatCard label="Active Users"   value="—"  sub="This month" />
          <StatCard label="Premium Users"  value="—"  sub="Subscribed" />
          <StatCard label="Sessions Today" value="—"  sub="Plays today" />
        </div>

        {/* Quick actions */}
        <p style={{
          margin: '0 0 14px',
          fontSize: 9, letterSpacing: 5,
          textTransform: 'uppercase',
          color: C.textDim, fontWeight: 400,
        }}>Quick Actions</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
          <button
            onClick={() => setView('upload')}
            style={{
              padding: '14px 28px',
              background: C.goldBright,
              color: C.bg,
              border: 'none',
              borderRadius: 99,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            ◈  Upload New Track
          </button>

          <button style={{
            padding: '13px 24px',
            background: 'transparent',
            color: C.goldBright,
            border: `1px solid ${C.borderGold}`,
            borderRadius: 99,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 1,
          }}>
            ◎  View All Tracks
          </button>

          <button style={{
            padding: '13px 24px',
            background: 'transparent',
            color: C.goldBright,
            border: `1px solid ${C.borderGold}`,
            borderRadius: 99,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 1,
          }}>
            ◐  Manage Users
          </button>
        </div>

        {/* Recent activity placeholder */}
        <p style={{
          margin: '0 0 14px',
          fontSize: 9, letterSpacing: 5,
          textTransform: 'uppercase',
          color: C.textDim, fontWeight: 400,
        }}>Recent Activity</p>

        <div style={{
          background: C.bgCardDeep,
          border: `1px solid ${C.borderGold}`,
          borderRadius: 18,
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '12px 20px',
            borderBottom: `1px solid ${C.borderGold}`,
            background: C.bgHero,
          }}>
            {['Track', 'Category', 'Status', 'Uploaded'].map((h) => (
              <span key={h} style={{
                fontSize: 9, letterSpacing: 3,
                textTransform: 'uppercase',
                color: C.textDim, fontWeight: 500,
              }}>{h}</span>
            ))}
          </div>

          {/* Empty state */}
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
          }}>
            <p style={{
              margin: 0, fontSize: 12,
              color: C.textDim, letterSpacing: 2,
              textTransform: 'uppercase', fontWeight: 300,
            }}>No tracks uploaded yet</p>
            <button
              onClick={() => setView('upload')}
              style={{
                marginTop: 16,
                padding: '10px 22px',
                background: 'rgba(212,168,40,0.08)',
                color: C.goldBright,
                border: `1px solid ${C.borderGold}`,
                borderRadius: 99,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              Upload your first track →
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}