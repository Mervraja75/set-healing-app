// =======================================
// Admin App Root
// Handles Login → Dashboard switch (UI-only)
// =======================================

import { useState } from 'react';

import AdminLogin from './components/AdminLogin';
import Dashboard from './pages/Dashboard';

import './index.css';

export default function App() {
  // SECTION — Admin auth state (UI-only)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app-root">
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <AdminLogin onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}