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
  textDim:      '#7A60A0',

  borderGold:   goldAlpha(0.18),
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.15)',

  aurora:       '#7EFFD4',
  errorBg:      'rgba(255, 80, 80, 0.08)',
  errorBorder:  'rgba(255, 80, 80, 0.25)',
  errorText:    '#FF8080',
};

const CATEGORY_ICONS: Record<string, string> = {
  sleep: '◐', calm: '◎', focus: '◈', energy: '◆',
};

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

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function Tracks({ onBack }: { onBack?: () => void }) {
  const [tracks,      setTracks]      = useState<Track[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [confirmId,   setConfirmId]   = useState<string | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);

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
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none',
              color: C.textDim, fontSize: 11, letterSpacing: 1,
              cursor: 'pointer', padding: 0, marginBottom: 20,
            }}
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
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
          }}>Tracks</h1>
          <p style={{
            margin: 0, fontSize: 13,
            color: C.textMid, fontWeight: 300,
          }}>{loading ? 'Loading…' : `${tracks.length} track${tracks.length === 1 ? '' : 's'} uploaded`}</p>
        </div>

        {/* Gold rule */}
        <div style={{
          height: 1, background: C.borderGold, marginBottom: 28,
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

        {/* Table */}
        <div style={{
          background: C.bgCardDeep,
          border: `1px solid ${C.borderGold}`,
          borderRadius: 18,
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
            padding: '12px 20px',
            borderBottom: `1px solid ${C.borderGold}`,
            background: C.bgHero,
            gap: 12,
          }}>
            {['Track', 'Category', 'Uploaded', 'Preview', ''].map((h) => (
              <span key={h} style={{
                fontSize: 9, letterSpacing: 3,
                textTransform: 'uppercase',
                color: C.textDim, fontWeight: 500,
              }}>{h}</span>
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

          {/* Rows */}
          {!loading && tracks.map((track) => {
            const isConfirming = confirmId === track.id;
            const isDeleting = deletingId === track.id;

            return (
              <div
                key={track.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
                  gap: 12,
                  padding: '14px 20px',
                  borderBottom: `1px solid ${C.borderPurple}`,
                  alignItems: 'center',
                }}
              >
                <span style={{
                  fontSize: 13, fontWeight: 500,
                  color: C.textBright,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{track.title}</span>

                <span style={{
                  fontSize: 12, color: C.textMuted,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ color: C.goldBright }}>{CATEGORY_ICONS[track.category] ?? '○'}</span>
                  {track.category}
                </span>

                <span style={{ fontSize: 12, color: C.textMuted }}>
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
