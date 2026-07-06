// =======================================
// services/UserService.ts
// Day 99.1 — Role-based access control
// Reads/writes user roles in Firestore
// =======================================

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserRole = 'admin' | 'customer';

/* ──────────────────────────────────────
   getUserRole
   Returns 'admin' if users/{uid}.role === 'admin',
   otherwise defaults to 'customer'.
────────────────────────────────────────*/
export async function getUserRole(uid: string): Promise<UserRole> {
  console.log('[UserService] getUserRole — querying users/' + uid);
  const snap = await getDoc(doc(db, 'users', uid));
  console.log('[UserService] Document exists:', snap.exists());
  console.log('[UserService] Document data:', snap.exists() ? snap.data() : 'none');
  console.log('[UserService] role field:', snap.exists() ? snap.data().role : 'none');
  if (snap.exists() && snap.data().role === 'admin') return 'admin';
  return 'customer';
}

/* ──────────────────────────────────────
   setUserRole
   Writes (or merges) the role field on
   the users/{uid} document.
────────────────────────────────────────*/
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}
