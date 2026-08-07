// =======================================
// SCREEN: Tracks (src/pages/Tracks.tsx)
// Purpose: Browse, preview, and delete uploaded tracks
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { GOLD, goldAlpha } from '../theme/colors';
import { db, storage } from '../services/firebase';

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

  borderGold:   goldAlpha(0.18),
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.15)',

  aurora:       '#7EFFD4',
  errorBg:      'rgba(255, 80, 80, 0.08)',
  errorBorder:  'rgba(255, 80, 80, 0.25)',
  errorText:    '#FF8080',

  shadowCard: '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
};

/* ---------------------------------------
   TYPE SCALE (mirrors Dashboard.tsx)
---------------------------------------- */
const T = {
  eyebrow: {
    fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const,
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

const CATEGORY_ICONS: Record<string, string> = {
  sleep: '◐', calm: '◎', focus: '◈', energy: '◆',
};

const KNOWN_CATEGORIES = ['sleep', 'calm', 'focus', 'energy'];

type SortOrder = 'newest' | 'oldest' | 'title';

/* ---------------------------------------
   TYPES
---------------------------------------- */
type Track = {
  id: string;
  title: string;
  category: string;
  url: string;
  filePath: string;
  createdAt: Timestamp | null;
};

/* ---------------------------------------
   HELPERS
---------------------------------------- */
function formatDate(ts: Timestamp | null): string {
  if (!ts) return 'Just now';
  return ts.toDate().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function Tracks({ onBack }: { onBack?: () => void }) {
  const [tracks,      setTracks]      = useState<Track[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [confirmId,   setConfirmId]   = useState<string | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);

  const [searchQuery,     setSearchQuery]     = useState('');
  const [categoryFilter,  setCategoryFilter]  = useState<string>('all');
  const [sortOrder,       setSortOrder]       = useState<SortOrder>('newest');

  useEffect(() => {
    const q = query(collection(db, 'tracks'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTracks(snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? 'Untitled',
            category: data.category ?? 'sleep',
            url: data.url ?? '',
            filePath: data.filePath ?? '',
            createdAt: data.createdAt ?? null,
          };
        }));
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load tracks:', err);
        setError('Failed to load tracks. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (track: Track) => {
    setDeletingId(track.id);
    setError(null);
    try {
      await deleteDoc(doc(db, 'tracks', track.id));
      if (track.filePath) {
        try {
          await deleteObject(ref(storage, track.filePath));
        } catch (storageErr) {
          console.warn('Storage file already missing or failed to delete:', storageErr);
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete track. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  // Categories available in the filter bar: known ones first, then any
  // unrecognized categories found in the live data, so it never hides tracks.
  const categories = [
    ...KNOWN_CATEGORIES,
    ...Array.from(new Set(tracks.map((t) => t.category))).filter(
      (c) => !KNOWN_CATEGORIES.includes(c)
    ),
  ];

  const visibleTracks = tracks
    .filter((t) =>
      t.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
    .sort((a, b) => {
      if (sortOrder === 'title') {
        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      }
      const aTime = a.createdAt?.toMillis() ?? 0;
      const bTime = b.createdAt?.toMillis() ?? 0;
      return sortOrder === 'oldest' ? aTime - bTime : bTime - aTime;
    });

  const isFiltered = searchQuery.trim() !== '' || categoryFilter !== 'all';

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Jost', 'Inter', system-ui, sans-serif",
      padding: '40px 36px',
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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto' }}>

        {/* Back link */}
        {onBack && (
          <button
            className="sh-link"
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none',
              color: C.textDim, fontSize: 11, letterSpacing: 1,
              cursor: 'pointer', padding: 0, marginBottom: 22,
            }}
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <p style={{ ...T.eyebrow, margin: '0 0 8px' }}>Control Centre</p>
          <h1 style={{ ...T.h1, margin: '0 0 8px' }}>Tracks</h1>
          <p style={{ ...T.subtitle, margin: 0 }}>
            {loading
              ? 'Loading…'
              : isFiltered
                ? `${visibleTracks.length} of ${tracks.length} track${tracks.length === 1 ? '' : 's'}`
                : `${tracks.length} track${tracks.length === 1 ? '' : 's'} uploaded`}
          </p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold, marginBottom: 28,
        }} />

        {/* Search, filter & sort controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: C.textDim, fontSize: 13, pointerEvents: 'none',
            }}>⌕</span>
            <input
              className="sh-field"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title…"
              style={{
                width: '100%',
                background: C.bgCard,
                border: `1px solid ${C.borderGold}`,
                borderRadius: 99,
                padding: '9px 14px 9px 34px',
                fontSize: 13,
                color: C.textBright,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['all', ...categories].map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  className={`sh-pill ${active ? 'sh-pill--active' : 'sh-pill--inactive'}`}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 13px',
                    background: active ? C.goldBright : 'transparent',
                    border: `1px solid ${active ? C.goldBright : C.borderPurple}`,
                    borderRadius: 99,
                    color: active ? C.bg : C.textMuted,
                    fontSize: 11, fontWeight: active ? 600 : 500,
                    letterSpacing: 0.3,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 3px 10px rgba(215,136,42,0.25)' : 'none',
                  }}
                >
                  {cat !== 'all' && (
                    <span style={{ color: active ? C.bg : C.goldBright }}>
                      {CATEGORY_ICONS[cat] ?? '○'}
                    </span>
                  )}
                  {cat === 'all' ? 'All' : capitalize(cat)}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            className="sh-field"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            style={{
              marginLeft: 'auto',
              background: C.bgCard,
              border: `1px solid ${C.borderGold}`,
              borderRadius: 99,
              padding: '9px 14px',
              fontSize: 12, fontWeight: 500,
              color: C.textMid,
              fontFamily: 'inherit',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

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

        {/* Table */}
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
            gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
            padding: '14px 22px',
            borderBottom: `1px solid ${C.borderGold}`,
            background: C.bgHero,
            gap: 12,
          }}>
            {['Track', 'Category', 'Uploaded', 'Preview', ''].map((h) => (
              <span key={h} style={T.tableHeader}>{h}</span>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{
                margin: 0, fontSize: 12,
                color: C.textDim, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 300,
              }}>Loading tracks…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && tracks.length === 0 && !error && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{
                margin: 0, fontSize: 12,
                color: C.textDim, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 300,
              }}>No tracks uploaded yet</p>
            </div>
          )}

          {/* No results for current search/filter */}
          {!loading && tracks.length > 0 && visibleTracks.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{
                margin: 0, fontSize: 12,
                color: C.textDim, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 300,
              }}>No tracks match your search</p>
            </div>
          )}

          {/* Rows */}
          {!loading && visibleTracks.map((track, i) => {
            const isConfirming = confirmId === track.id;
            const isDeleting = deletingId === track.id;

            return (
              <div
                key={track.id}
                className="sh-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
                  gap: 12,
                  padding: '16px 22px',
                  borderBottom: i === visibleTracks.length - 1 ? 'none' : `1px solid ${C.borderPurple}`,
                  alignItems: 'center',
                }}
              >
                <span style={{
                  fontSize: 13.5, fontWeight: 500,
                  color: C.textBright,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{track.title}</span>

                <span style={{
                  fontSize: 12.5, color: C.textMuted,
                  display: 'flex', alignItems: 'center', gap: 6,
                  textTransform: 'capitalize',
                }}>
                  <span style={{ color: C.goldBright }}>{CATEGORY_ICONS[track.category] ?? '○'}</span>
                  {track.category}
                </span>

                <span style={{ fontSize: 12.5, color: C.textMuted }}>
                  {formatDate(track.createdAt)}
                </span>

                <div>
                  {track.url ? (
                    <audio controls src={track.url} style={{ height: 30, width: '100%', maxWidth: 220 }} />
                  ) : (
                    <span style={{ fontSize: 11, color: C.textDim }}>No audio</span>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  {isConfirming ? (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        className="sh-btn sh-btn-danger"
                        onClick={() => handleDelete(track)}
                        disabled={isDeleting}
                        style={{
                          padding: '6px 12px',
                          background: C.errorBg,
                          border: `1px solid ${C.errorBorder}`,
                          borderRadius: 99,
                          color: C.errorText,
                          fontSize: 10, fontWeight: 600,
                          letterSpacing: 0.5,
                          cursor: isDeleting ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isDeleting ? 'Deleting…' : 'Confirm'}
                      </button>
                      <button
                        className="sh-btn sh-btn-ghost"
                        onClick={() => setConfirmId(null)}
                        disabled={isDeleting}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: `1px solid ${C.borderPurple}`,
                          borderRadius: 99,
                          color: C.textDim,
                          fontSize: 10, fontWeight: 500,
                          cursor: isDeleting ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="sh-btn sh-btn-ghost"
                      onClick={() => setConfirmId(track.id)}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        border: `1px solid ${C.borderPurple}`,
                        borderRadius: 99,
                        color: C.textDim,
                        fontSize: 10, fontWeight: 500,
                        letterSpacing: 0.5,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
