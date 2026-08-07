// =======================================
// SCREEN: Dashboard (src/pages/Dashboard.tsx)
// Purpose: Admin control centre
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { GOLD, goldAlpha } from '../theme/colors';
import Tracks from './Tracks';
import UploadTrack from './UploadTrack';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#120828',
  bgCard:       '#1E0A30',
  bgCardDeep:   '#250D3D',
  bgHero:       '#2D0F50',

  goldBright:   GOLD,
  goldMid:      GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#9683BE',
  textFaint:    '#6E5993',

  borderGold:   goldAlpha(0.18),
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.15)',

  aurora:       '#7EFFD4',

  shadowCard:    '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
  shadowSidebar: '10px 0 34px rgba(0,0,0,0.28)',
  shadowStat:    '0 8px 22px rgba(0,0,0,0.3)',
};

/* ---------------------------------------
   TYPE SCALE (shared across the dashboard)
---------------------------------------- */
const T = {
  eyebrow: {
    fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const,
    color: C.textDim, fontWeight: 600,
  },
  sectionLabel: {
    fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' as const,
    color: C.textDim, fontWeight: 600,
  },
  h1: {
    fontSize: 34, fontWeight: 800, color: C.textBright, letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14, fontWeight: 400, color: C.textMid,
  },
  tableHeader: {
    fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const,
    color: C.textDim, fontWeight: 600,
  },
};

/* ---------------------------------------
   STAT CARD
---------------------------------------- */
function StatCard({
  label,
  value,
  sub,
  live = false,
}: {
  label: string;
  value: string;
  sub?: string;
  /** Live cards (backed by real data) get the prominent gold treatment; placeholder cards read as dimmed/inactive. */
  live?: boolean;
}) {
  return (
    <div className="sh-stat-card" style={{
      background: live ? C.bgCardDeep : C.bgCard,
      border: `1px solid ${live ? C.borderGold : C.borderPurple}`,
      borderRadius: 16,
      padding: '22px 24px',
      flex: 1,
      minWidth: 150,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: live ? C.shadowStat : 'none',
      opacity: live ? 1 : 0.7,
    }}>
      {/* Gold top bar — solid for live data, faint dashed hint for placeholders */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: live ? C.goldBright : C.borderPurple,
        opacity: live ? 0.5 : 1,
      }} />
      <p style={{ ...T.eyebrow, margin: '0 0 8px' }}>{label}</p>
      <p style={{
        margin: '0 0 4px',
        fontSize: 30,
        fontWeight: 800,
        color: live ? C.goldBright : C.textFaint,
        letterSpacing: -0.5,
      }}>{value}</p>
      {sub && (
        <p style={{
          margin: 0,
          fontSize: 11.5,
          color: live ? C.textMuted : C.textFaint,
          fontWeight: 400,
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
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className="sh-nav-item"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={disabled ? 'Coming soon' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '11px 14px',
        borderRadius: 12,
        border: active ? `1px solid ${C.borderGold}` : '1px solid transparent',
        background: active ? goldAlpha(0.09) : 'transparent',
        boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        marginBottom: 4,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16, color: active ? C.goldBright : C.textDim }}>
          {icon}
        </span>
        <span style={{
          fontSize: 12.5,
          fontWeight: active ? 600 : 400,
          color: active ? C.textBright : C.textMuted,
          letterSpacing: 0.3,
        }}>{label}</span>
      </span>
      {disabled && (
        <span style={{
          fontSize: 8, letterSpacing: 0.5,
          color: C.textDim, textTransform: 'uppercase',
          border: `1px solid ${C.borderPurple}`,
          borderRadius: 99, padding: '2px 6px',
        }}>Soon</span>
      )}
    </button>
  );
}

/* ---------------------------------------
   MAIN COMPONENT
---------------------------------------- */
type RecentTrack = {
  id: string;
  title: string;
  category: string;
  createdAt: Timestamp | null;
};

function formatDate(ts: Timestamp | null): string {
  if (!ts) return 'Just now';
  return ts.toDate().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function Dashboard() {
  const [view, setView] = useState<'home' | 'upload' | 'tracks' | string>('home');

  const [totalTracks,  setTotalTracks]  = useState<number | null>(null);
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tracks'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTotalTracks(snapshot.size);
        setRecentTracks(snapshot.docs.slice(0, 5).map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? 'Untitled',
            category: data.category ?? 'sleep',
            createdAt: data.createdAt ?? null,
          };
        }));
        setStatsLoading(false);
      },
      (err) => {
        console.error('Failed to load dashboard stats:', err);
        setStatsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (view === 'upload') {
    return (
      <UploadTrack
        onBack={() => setView('home')}
        onViewTracks={() => setView('tracks')}
      />
    );
  }

  if (view === 'tracks') {
    return <Tracks onBack={() => setView('home')} />;
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
        boxShadow: C.shadowSidebar,
        padding: '32px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        zIndex: 2,
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
          <p style={{ ...T.eyebrow, margin: 0 }}>Admin Panel</p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold, marginBottom: 16,
        }} />

        {/* Nav items */}
        <NavItem icon="◉" label="Dashboard"    active={view === 'home'}   onClick={() => setView('home')} />
        <NavItem icon="◈" label="Upload Track" active={view === 'upload'} onClick={() => setView('upload')} />
        <NavItem icon="◎" label="Tracks"       active={view === 'tracks'} onClick={() => setView('tracks')} />
        <NavItem icon="◐" label="Users"        disabled />
        <NavItem icon="◆" label="Analytics"    disabled />
        <NavItem icon="○" label="Settings"     disabled />

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
      <main className="sh-scroll" style={{
        flex: 1,
        padding: '44px 40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Page header */}
        <div style={{ marginBottom: 34 }}>
          <p style={{ ...T.eyebrow, margin: '0 0 8px' }}>Control Centre</p>
          <h1 style={{ ...T.h1, margin: '0 0 8px' }}>Dashboard</h1>
          <p style={{ ...T.subtitle, margin: 0 }}>Manage your SET Healing platform</p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold,
          marginBottom: 32,
        }} />

        {/* Stat cards */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          <StatCard
            live
            label="Total Tracks"
            value={statsLoading ? '—' : String(totalTracks ?? 0)}
            sub="Tracks uploaded"
          />
          <StatCard label="Active Users"   value="—"  sub="Not tracked yet" />
          <StatCard label="Premium Users"  value="—"  sub="Not tracked yet" />
          <StatCard label="Sessions Today" value="—"  sub="Not tracked yet" />
        </div>

        {/* Quick actions */}
        <p style={{ ...T.sectionLabel, margin: '0 0 16px' }}>Quick Actions</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          <button
            className="sh-btn sh-btn-primary"
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
              boxShadow: '0 4px 14px rgba(215,136,42,0.22)',
            }}
          >
            ◈  Upload New Track
          </button>

          <button
            className="sh-btn sh-btn-secondary"
            onClick={() => setView('tracks')}
            style={{
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

          <button
            className="sh-btn"
            disabled
            title="Coming soon"
            style={{
              padding: '13px 24px',
              background: 'transparent',
              color: C.textDim,
              border: `1px solid ${C.borderPurple}`,
              borderRadius: 99,
              cursor: 'not-allowed',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 1,
              opacity: 0.55,
            }}>
            ◐  Manage Users <span style={{ fontSize: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>· Soon</span>
          </button>
        </div>

        {/* Recent activity placeholder */}
        <p style={{ ...T.sectionLabel, margin: '0 0 16px' }}>Recent Activity</p>

        <div style={{
          background: C.bgCardDeep,
          border: `1px solid ${C.borderGold}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: C.shadowCard,
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '14px 22px',
            borderBottom: `1px solid ${C.borderGold}`,
            background: C.bgHero,
          }}>
            {['Track', 'Category', 'Status', 'Uploaded'].map((h) => (
              <span key={h} style={T.tableHeader}>{h}</span>
            ))}
          </div>

          {/* Loading state */}
          {statsLoading && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{
                margin: 0, fontSize: 12,
                color: C.textDim, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 300,
              }}>Loading…</p>
            </div>
          )}

          {/* Empty state */}
          {!statsLoading && recentTracks.length === 0 && (
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
                className="sh-btn sh-btn-secondary"
                onClick={() => setView('upload')}
                style={{
                  marginTop: 16,
                  padding: '10px 22px',
                  background: goldAlpha(0.08),
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
          )}

          {/* Rows */}
          {!statsLoading && recentTracks.map((track, i) => (
            <div
              key={track.id}
              className="sh-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '16px 22px',
                borderBottom: i === recentTracks.length - 1 ? 'none' : `1px solid ${C.borderPurple}`,
                alignItems: 'center',
              }}
            >
              <span style={{
                fontSize: 13.5, fontWeight: 500, color: C.textBright,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{track.title}</span>
              <span style={{ fontSize: 12.5, color: C.textMuted, textTransform: 'capitalize' }}>
                {track.category}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 10.5, color: C.aurora, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.aurora }} />
                Published
              </span>
              <span style={{ fontSize: 12.5, color: C.textMuted }}>
                {formatDate(track.createdAt)}
              </span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}