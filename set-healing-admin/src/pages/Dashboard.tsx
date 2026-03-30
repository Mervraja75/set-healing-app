// =======================================
// SCREEN: Dashboard
// Purpose: Admin navigation
// =======================================

import { useState } from 'react';
import UploadTrack from './UploadTrack';

export default function Dashboard() {
  const [view, setView] = useState<'home' | 'upload'>('home');

  if (view === 'upload') {
    return <UploadTrack />;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>SET Healing App — Dashboard</h1>

      <button
        onClick={() => setView('upload')}
        style={{
          marginTop: 20,
          padding: '12px 20px',
          backgroundColor: '#5A189A',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Upload New Track
      </button>
    </div>
  );
}