# Healing Frequency App — Architecture

## 1) App Summary
Healing Frequency is a mobile app that lets users play healing sound sessions (sleep, calm, focus, energy).
The app is currently focused on interface + stable audio playback. Payments and real authentication are planned later.

---

## 2) Tech Stack
- Expo (React Native)
- expo-router (navigation)
- expo-av (audio playback) *(deprecated warning appears — planned upgrade later)*
- Context API (global state)
- TypeScript

---

## 3) Routing + Screens

### App Entry
- `app/_layout.tsx`
  - Root stack navigator
  - Wraps the app in Providers (PlayerProvider, AuthProvider if used)

### Tabs Layout
- `app/(tabs)/_layout.tsx`
  - Bottom tabs: Profile | Home | Healing

### Tab Screens
- `app/(tabs)/index.tsx` → Home screen
- `app/(tabs)/healing.tsx` → Healing collections
- `app/(tabs)/profile.tsx` → Profile / Guest / Auth entry

### Other Screens
- `app/test.tsx` → Player screen (audio playback UI)
- `app/categories.tsx` → Category list (routes to Player)
- `app/login.tsx` → Login UI (no real auth yet unless added)
- `app/register.tsx` → Register UI
- `app/paywall.tsx` → Paywall UI only (no real payments yet)

---

## 4) State Management (Context)

### Player Context
- File: `context/PlayerContext.tsx`
- Responsibilities:
  - Tracks whether audio is playing (UI state)
  - Stores last selected category (optional UX)

**Used by:**
- Player screen (`app/test.tsx`)
- Categories screen (`app/categories.tsx`)
- Any screen that needs playback UI state

### Auth Context (Guest Mode)
- File: `context/AuthContext.tsx`
- Responsibilities:
  - Tracks whether user is in guest mode
  - Future: login/logout + user profile

**Used by:**
- Profile screen (`app/(tabs)/profile.tsx`)

---

## 5) Audio System

### Current Approach
- `expo-av` is used in `app/test.tsx`
- Playback controlled with:
  - `Audio.Sound.createAsync`
  - `setOnPlaybackStatusUpdate` (progress updates)
  - teardown/unload on stop/unmount

### Known Notes
- iOS silent mode is enabled using:
  - `Audio.setAudioModeAsync({ playsInSilentModeIOS: true })`
- Looping is supported
- Volume is controlled using a slider UI component

### Future Plan
- Replace expo-av with:
  - `expo-audio` / `expo-video` (Expo SDK roadmap)

---

## 6) Components

### Shared UI Components
- `components/BackButton.tsx`
  - Standard back navigation button
  - Uses router.back() or Link when `to` is provided

- `components/CustomSlider.tsx`
  - Styled slider component used for volume (and later progress control)

---

## 7) Data (Current vs Future)

### Current
- Audio assets are stored locally:
  - `assets/sounds/*.mp3`

### Future (Backend Plan)
- Store track list + metadata in Firestore
- Store audio files in Firebase Storage
- App loads categories/tracks dynamically
- Admin dashboard uploads tracks + metadata

**Important rule for maintainability:**
UI screens should NOT call Firebase directly.
Create a `lib/` layer such as:
- `lib/firebase.ts`
- `lib/tracks.ts`
- `lib/auth.ts`

---

## 8) Handoff Notes (For Next Developer)

### What’s finished
- Bottom tabs navigation
- Polished Home/Healing/Profile UI
- Working audio playback with progress, volume, looping
- Paywall UI (visual only)

### What’s planned next
- Real auth (Firebase Auth)
- Backend tracks (Firestore + Storage)
- Favorites + history
- Payment integration (Stripe or RevenueCat)

### How to run
```bash
npm install
npx expo start