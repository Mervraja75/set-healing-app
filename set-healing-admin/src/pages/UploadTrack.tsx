// =======================================
// SCREEN: UploadTrack
// Purpose: Upload audio files to Firebase Storage
// Day 41 + Day 43 category selector + Day 44 polish
// =======================================

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { db, storage } from '../services/firebase';

const CATEGORY_OPTIONS = [
  { id: 'sleep', label: 'Sleep' },
  { id: 'calm', label: 'Calm' },
  { id: 'focus', label: 'Focus' },
  { id: 'energy', label: 'Energy' },
];

export default function UploadTrack() {
  /* -------------------------------------
     SECTION A — Form state
  -------------------------------------- */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('sleep');
  const [file, setFile] = useState<File | null>(null);

  /* -------------------------------------
     SECTION B — Upload state
  -------------------------------------- */
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------
     SECTION C — File picker handler
  -------------------------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadedUrl(null);
    setProgress(0);
    setUploadComplete(false);
    setIsSaving(false);
    setFile(e.target.files?.[0] || null);
  };

  /* -------------------------------------
     SECTION D — Upload handler
  -------------------------------------- */
  const handleUpload = async () => {
    if (!title || !file) {
      alert('Please add a title and select an audio file.');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setIsSaving(false);
      setProgress(0);
      setUploadComplete(false);

      // Storage path
      const filePath = `tracks/${category}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);

      // Upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            // File upload is done here
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            setUploadedUrl(url);
            setIsUploading(false);
            setIsSaving(true);

            // Save metadata to Firestore
            const trackDoc = {
              title,
              category,
              url,
              filePath,
              isPremium: false,
              durationMs: null,
              createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'tracks'), trackDoc);

            console.log('Uploaded file URL:', url);
            console.log('Saved track metadata with ID:', docRef.id);
            console.log('Saved track metadata:', trackDoc);

            setUploadComplete(true);
            alert('Track uploaded and metadata saved!');

            // show "Uploaded" briefly, then reset button text
            setTimeout(() => {
              setUploadComplete(false);
            }, 2500);
          } catch (err) {
            console.error(err);
            setError('File uploaded, but saving metadata failed.');
          } finally {
            setIsSaving(false);

            // reset form
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

  /* -------------------------------------
     SECTION E — UI Layout
  -------------------------------------- */
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Track</h1>
      <p style={styles.subtitle}>Upload audio files to Firebase Storage</p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.field}>
        <label style={styles.label}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          placeholder="Track title"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Category</label>
        <p style={styles.helper}>Choose one category for this track</p>

        <div style={styles.categoryGrid}>
          {CATEGORY_OPTIONS.map((option) => {
            const isActive = category === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCategory(option.id)}
                style={{
                  ...styles.categoryButton,
                  ...(isActive ? styles.categoryButtonActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.categoryButtonText,
                    ...(isActive ? styles.categoryButtonTextActive : {}),
                  }}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Audio File</label>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <div style={styles.helper}>
          {file
            ? `${file.name} (${Math.round(file.size / 1024)} KB)`
            : 'No file selected'}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || isSaving}
        style={styles.button}
      >
        {isUploading
          ? `Uploading... ${progress}%`
          : isSaving
            ? 'Saving metadata...'
            : uploadComplete
              ? 'Uploaded'
              : 'Upload'}
      </button>

      {progress > 0 && (
        <div style={styles.progressWrap}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
            }}
          />
        </div>
      )}

      {uploadedUrl && (
        <div style={styles.successBox}>
          <p style={{ margin: 0, fontWeight: 600 }}>Uploaded successfully!</p>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>
            {uploadedUrl}
          </p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 720,
    margin: '48px auto',
    padding: 24,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 30px rgba(20,10,50,0.06)',
  },
  title: {
    color: '#5A189A',
    marginBottom: 6,
  },
  subtitle: {
    color: '#666',
    marginBottom: 20,
  },
  field: {
    marginTop: 16,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontWeight: 600,
    color: '#333',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #E6DCF7',
    outline: 'none',
  },
  helper: {
    marginTop: 8,
    color: '#666',
    fontSize: 13,
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 10,
    marginTop: 8,
  },
  categoryButton: {
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #E6DCF7',
    background: '#FFFFFF',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  categoryButtonActive: {
    background: '#F2EAFF',
    border: '1px solid #5A189A',
  },
  categoryButtonText: {
    color: '#555',
    fontWeight: 600,
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#5A189A',
  },
  button: {
    marginTop: 22,
    padding: '12px 20px',
    backgroundColor: '#5A189A',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  progressWrap: {
    marginTop: 16,
    height: 10,
    background: '#EEE6FF',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: '#5A189A',
    transition: 'width 0.2s ease',
  },
  error: {
    marginBottom: 12,
    padding: '10px 12px',
    borderRadius: 8,
    background: '#ffefef',
    color: '#8b1b1b',
    border: '1px solid #ffd5d5',
  },
  successBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 10,
    background: '#f2eaff',
    color: '#3A0CA3',
    border: '1px solid #e0d3ff',
    wordBreak: 'break-all',
  },
};