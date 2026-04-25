// =======================================
// SCREEN: UploadTrack (src/pages/UploadTrack.tsx)
// Purpose: Upload audio files to Firebase Storage
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { db, storage } from '../services/firebase';

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
  borderInput:  'rgba(180, 140, 255, 0.20)',

  glowGold:     'rgba(212, 168, 40, 0.08)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',

  aurora:       '#7EFFD4',
  errorBg:      'rgba(255, 80, 80, 0.08)',
  errorBorder:  'rgba(255, 80, 80, 0.25)',
  errorText:    '#FF8080',
  successBg:    'rgba(126, 255, 212, 0.08)',
  successBorder:'rgba(126, 255, 212, 0.25)',
};

/* ---------------------------------------
   STATIC DATA
---------------------------------------- */
const CATEGORY_OPTIONS = [
  { id: 'sleep',  label: 'Sleep',  icon: '◐' },
  { id: 'calm',   label: 'Calm',   icon: '◎' },
  { id: 'focus',  label: 'Focus',  icon: '◈' },
  { id: 'energy', label: 'Energy', icon: '◆' },
];

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function UploadTrack() {
  /* State */
  const [title,          setTitle]          = useState('');
  const [category,       setCategory]       = useState('sleep');
  const [file,           setFile]           = useState<File | null>(null);
  const [isUploading,    setIsUploading]    = useState(false);
  const [isSaving,       setIsSaving]       = useState(false);
  const [progress,       setProgress]       = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedUrl,    setUploadedUrl]    = useState<string | null>(null);
  const [error,          setError]          = useState<string | null>(null);
  const [dragOver,       setDragOver]       = useState(false);

  /* File picker */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadedUrl(null);
    setProgress(0);
    setUploadComplete(false);
    setIsSaving(false);
    setFile(e.target.files?.[0] || null);
  };

  /* Drag and drop */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('audio/')) {
      setError(null);
      setUploadedUrl(null);
      setProgress(0);
      setUploadComplete(false);
      setFile(dropped);
    } else {
      setError('Please drop a valid audio file.');
    }
  };

  /* Upload */
  const handleUpload = async () => {
    if (!title || !file) {
      setError('Please add a title and select an audio file.');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setIsSaving(false);
      setProgress(0);
      setUploadComplete(false);

      const filePath   = `tracks/${category}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(percent));
        },
        (err) => {
          console.error('Upload error:', err);
          setError('Upload failed. Please try again.');
          setIsUploading(false);
          setIsSaving(false);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadedUrl(url);
            setIsUploading(false);
            setIsSaving(true);

            const trackDoc = {
              title, category, url, filePath,
              isPremium: false,
              durationMs: null,
              createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'tracks'), trackDoc);
            console.log('Saved track:', docRef.id, trackDoc);

            setUploadComplete(true);

            setTimeout(() => setUploadComplete(false), 2500);
          } catch (err) {
            console.error(err);
            setError('File uploaded, but saving metadata failed.');
          } finally {
            setIsSaving(false);
            setTitle('');
            setCategory('sleep');
            setFile(null);
            setProgress(0);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError('Something went wrong during upload.');
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const isbusy = isUploading || isSaving;

  /* Button label */
  const btnLabel = isUploading
    ? `Uploading… ${progress}%`
    : isSaving
      ? 'Saving metadata…'
      : uploadComplete
        ? '✓ Uploaded'
        : 'Upload Track';

  /* ── UI ── */
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Jost', 'Inter', system-ui, sans-serif",
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '48px 24px',
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
        maxWidth: 680,
        background: C.bgCardDeep,
        border: `1px solid ${C.borderGold}`,
        borderRadius: 28,
        padding: '36px 36px 40px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}>

        {/* Card inner glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(212,168,40,0.06)', pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(212,168,40,0.08)',
            border: `1px solid ${C.borderGold}`,
            borderRadius: 99, padding: '6px 14px', marginBottom: 16,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: C.goldBright,
            }} />
            <span style={{
              fontSize: 9, letterSpacing: 4,
              textTransform: 'uppercase' as const,
              color: C.goldMid, fontWeight: 600,
            }}>Admin Upload</span>
          </div>

          <h1 style={{
            margin: '0 0 6px',
            fontSize: 28, fontWeight: 700,
            color: C.textBright, letterSpacing: -0.3,
          }}>Upload Track</h1>
          <p style={{
            margin: 0, fontSize: 13,
            color: C.textMid, fontWeight: 300,
          }}>Add a new healing audio session to the platform</p>
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

        {/* Success */}
        {uploadedUrl && (
          <div style={{
            marginBottom: 20, padding: '14px 16px',
            background: C.successBg,
            border: `1px solid ${C.successBorder}`,
            borderRadius: 12,
          }}>
            <p style={{
              margin: '0 0 4px', fontWeight: 600,
              color: C.aurora, fontSize: 13,
            }}>✓  Track uploaded successfully</p>
            <p style={{
              margin: 0, fontSize: 11,
              color: C.textDim, wordBreak: 'break-all' as const,
            }}>{uploadedUrl}</p>
          </div>
        )}

        {/* Title field */}
        <div style={{ marginBottom: 22 }}>
          <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 10, letterSpacing: 3,
            textTransform: 'uppercase' as const,
            color: C.textMuted, fontWeight: 500,
          }}>Track Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Theta Wave Journey"
            style={{
              display: 'block', width: '100%',
              padding: '13px 16px',
              background: C.bgHero,
              border: `1px solid ${C.borderInput}`,
              borderRadius: 12,
              color: C.textBright,
              fontSize: 14, fontWeight: 300,
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
            onFocus={(e) => e.target.style.borderColor = C.borderGold}
            onBlur={(e)  => e.target.style.borderColor = C.borderInput}
          />
        </div>

        {/* Category selector */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', marginBottom: 4,
            fontSize: 10, letterSpacing: 3,
            textTransform: 'uppercase' as const,
            color: C.textMuted, fontWeight: 500,
          }}>Category</label>
          <p style={{
            margin: '0 0 12px', fontSize: 11,
            color: C.textDim, fontWeight: 300,
          }}>Select one category for this session</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
          }}>
            {CATEGORY_OPTIONS.map((opt) => {
              const active = category === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategory(opt.id)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: 14,
                    border: active
                      ? `1px solid ${C.goldBright}`
                      : `1px solid ${C.borderPurple}`,
                    background: active
                      ? 'rgba(212,168,40,0.10)'
                      : C.bgHero,
                    cursor: 'pointer',
                    textAlign: 'center' as const,
                    transition: 'all 0.15s ease',
                    position: 'relative' as const,
                    overflow: 'hidden' as const,
                  }}
                >
                  {/* Active top bar */}
                  {active && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 2, background: C.goldBright,
                    }} />
                  )}
                  <div style={{
                    fontSize: 18, marginBottom: 5,
                    color: active ? C.goldBright : C.textDim,
                  }}>{opt.icon}</div>
                  <div style={{
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    color: active ? C.textBright : C.textDim,
                    letterSpacing: 0.5,
                  }}>{opt.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* File drop zone */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 10, letterSpacing: 3,
            textTransform: 'uppercase' as const,
            color: C.textMuted, fontWeight: 500,
          }}>Audio File</label>

          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '32px 20px',
              background: dragOver
                ? 'rgba(212,168,40,0.08)'
                : C.bgHero,
              border: `1px dashed ${dragOver ? C.goldBright : C.borderInput}`,
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: 28, color: C.textDim }}>◎</span>
            {file ? (
              <>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 500,
                  color: C.textBright,
                }}>{file.name}</p>
                <p style={{
                  margin: 0, fontSize: 11,
                  color: C.textMuted,
                }}>{Math.round(file.size / 1024)} KB · {file.type}</p>
              </>
            ) : (
              <>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 400,
                  color: C.textMuted,
                }}>Drop your audio file here</p>
                <p style={{
                  margin: 0, fontSize: 11,
                  color: C.textDim,
                }}>or click to browse — MP3, WAV, AAC supported</p>
              </>
            )}
          </label>
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 6,
            }}>
              <span style={{
                fontSize: 9, letterSpacing: 3,
                textTransform: 'uppercase' as const,
                color: C.textDim,
              }}>
                {isSaving ? 'Saving metadata…' : 'Uploading'}
              </span>
              <span style={{
                fontSize: 11, color: C.goldBright, fontWeight: 600,
              }}>{progress}%</span>
            </div>
            <div style={{
              height: 4, background: C.bgHero,
              borderRadius: 999, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: C.goldBright,
                borderRadius: 999,
                transition: 'width 0.2s ease',
              }} />
            </div>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={isbusy}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: isbusy ? 'rgba(212,168,40,0.4)' : C.goldBright,
            color: C.bg,
            border: 'none',
            borderRadius: 99,
            cursor: isbusy ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase' as const,
            transition: 'all 0.15s ease',
          }}
        >
          {btnLabel}
        </button>

      </div>
    </div>
  );
}