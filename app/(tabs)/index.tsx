// =======================================
// SCREEN: Home (app/(tabs)/index.tsx)
// Day 68 — Tablet landscape layout (two-column at width >= 768)
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';

import FavoriteButton from '@/components/FavoriteButton';
import { PlaylistTrack, usePlayer } from '@/context/PlayerContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { SkeletonBox } from '@/components/SkeletonBox';

const C = {
  bg: '#0A0616', bgCard: '#1A0D2E', bgCardDeep: '#160A28', bgHero: '#1E0A3C',
  goldBright: GOLD, goldMid: GOLD,
  textBright: '#FFFFFF', textMid: '#DDD0FF', textMuted: '#B09ACC', textDim: '#7A60A0',
  borderGold: goldAlpha(0.15), borderPurple: 'rgba(180, 140, 255, 0.10)',
  glowGold: goldAlpha(0.08), glowPurple: 'rgba(100, 50, 180, 0.15)',
};

type Track = {
  id: string; title: string; category: string; url: string;
  isPremium?: boolean; description?: string; createdAt?: any;
};

const QUICK_ACTIONS: (PlaylistTrack & { icon: string })[] = [
  { id: 'sleep', title: 'Sleep',  description: 'Slow frequencies for deep rest', sound: 'sleep', icon: '◐', favoriteType: 'track' },
  { id: 'focus', title: 'Focus',  description: 'Frequencies for concentration',   sound: 'focus', icon: '◈', favoriteType: 'track' },
  { id: 'calm',  title: 'Calm',   description: 'Relaxing sounds for peace',       sound: 'calm',  icon: '◎', favoriteType: 'track' },
];

type CategoryFilter = 'all' | 'sleep' | 'calm' | 'focus' | 'energy';

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all',    label: 'All' },
  { id: 'sleep',  label: 'Sleep' },
  { id: 'calm',   label: 'Calm' },
  { id: 'focus',  label: 'Focus' },
  { id: 'energy', label: 'Energy' },
];

function getCategoryDescription(cat: string) {
  const map: Record<string, string> = {
    sleep: 'Slow frequencies for deep rest', calm: 'Relaxing sounds for peace',
    focus: 'Frequencies for concentration',  energy: 'Uplifting tones for alertness',
  };
  return map[cat] ?? 'Uploaded healing session';
}

function SectionLabel({ title }: { title: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLine} />
      <Text style={styles.sectionLabelText}>{title}</Text>
      <View style={styles.sectionLabelLine} />
    </View>
  );
}

export default function HomeScreen() {
  const router            = useRouter();
  const { setPlaylist }   = usePlayer();
  const { isTabletLandscape, isTabletPortrait } = useResponsive();

  const [tracks,  setTracks]  = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const [reloadKey, setReloadKey] = useState(0);
  const handleRetry = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const snap  = await getDocs(query(collection(db, 'tracks'), orderBy('createdAt', 'desc')));
        const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Track, 'id'>) }));
        if (mounted) setTracks(items);
      } catch { if (mounted) setError('Could not load tracks.'); }
      finally   { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [reloadKey]);

  const popularTracks = useMemo(() => {
    const pref = tracks.filter((t) => t.category === 'sleep' || t.category === 'focus');
    return (pref.length ? pref : tracks).slice(0, 3);
  }, [tracks]);
  const newestTracks = useMemo(() => tracks.slice(0, 3), [tracks]);

  // Day 102 — search + category filter
  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'all';
  const filteredTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tracks.filter((t) =>
      (selectedCategory === 'all' || t.category === selectedCategory) &&
      (q === '' || t.title.toLowerCase().includes(q))
    );
  }, [tracks, searchQuery, selectedCategory]);

  const toPlaylist = (list: Track[]): PlaylistTrack[] =>
    list.map((t) => ({
      id: t.id, title: t.title,
      description: t.description ?? getCategoryDescription(t.category),
      sound: t.category, audioUrl: t.url,
      favoriteType: 'track',
    }));

  // Day 55 — load full list as playlist, jump to tapped track
  const handleTrackPress = (track: Track, list: Track[]) => {
    const pl  = toPlaylist(list);
    const idx = list.findIndex((t) => t.id === track.id);
    setPlaylist(pl, idx >= 0 ? idx : 0);
    router.push('/test');
  };

  const handleQuickAction = (action: PlaylistTrack) => {
    setPlaylist([action], 0);
    router.push('/test');
  };

  const handleHeroPress = () => {
    if (popularTracks.length > 0) setPlaylist(toPlaylist(popularTracks), 0);
    else setPlaylist([QUICK_ACTIONS[0]], 0);
    router.push('/test');
  };

  const renderTrack = (track: Track, list: Track[], badge?: string) => (
    <TouchableOpacity
      key={track.id}
      style={styles.trackCard}
      activeOpacity={0.78}
      onPress={() => handleTrackPress(track, list)}
    >
      <View style={styles.trackAccent} />
      <View style={styles.trackIcon}><Text style={styles.trackIconText}>◉</Text></View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackName}>{track.title}</Text>
        <Text style={styles.trackCat}>{track.category.toUpperCase()}</Text>
      </View>
      {badge && <View style={styles.trackBadge}><Text style={styles.trackBadgeText}>{badge}</Text></View>}
      <FavoriteButton
        size="sm"
        item={{
          type: 'track',
          itemId: track.id,
          title: track.title,
          subtitle: track.description ?? getCategoryDescription(track.category),
          sound: track.category,
          audioUrl: track.url,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, isTabletLandscape && styles.containerTablet, isTabletPortrait && styles.containerTabletPortrait]} showsVerticalScrollIndicator={false}>
      <View style={styles.glowTR} /><View style={styles.glowML} />

      {/* Hero — always full width */}
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Sound · Energy · Therapy</Text>
        <Text style={[styles.logoMark, isTabletPortrait && styles.logoMarkTabletP]}>SET</Text>
        <Text style={styles.logoSub}>Healing</Text>
        <Text style={styles.logoFull}>Sound Energy Therapy</Text>
        <Text style={[styles.tagline, isTabletPortrait && styles.taglineTabletP]}>Restore harmony through sacred frequency</Text>
      </View>
      <View style={styles.rule} />

      {/* Search + category filter */}
      <View style={styles.searchInputWrap}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tracks…"
          placeholderTextColor={C.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterChipsRow}>
        {CATEGORY_FILTERS.map((c) => {
          const active = selectedCategory === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedCategory(c.id)}
              activeOpacity={0.78}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isFiltering ? (
        <>
          <SectionLabel title={`Results${filteredTracks.length ? ` · ${filteredTracks.length}` : ''}`} />
          {loading ? (
            <View style={styles.trackList}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.trackCard}>
                  <SkeletonBox width={40} height={40} borderRadius={999} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <SkeletonBox width="70%" height={14} />
                    <SkeletonBox width="40%" height={10} />
                  </View>
                </View>
              ))}
            </View>
          ) : filteredTracks.length === 0 ? (
            <View style={styles.empty}><Text style={styles.emptyText}>No tracks match your search.</Text></View>
          ) : (
            <View style={styles.trackList}>
              {filteredTracks.map((t) => renderTrack(t, filteredTracks))}
            </View>
          )}
        </>
      ) : (
      /* Two-column on tablet, single column on phone */
      <View style={isTabletLandscape ? styles.tabletRow : undefined}>

        {/* Left column: hero card + quick actions */}
        <View style={isTabletLandscape ? styles.tabletLeft : undefined}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroDot} />
              <Text style={styles.heroBadgeText}>Begin today</Text>
            </View>
            <Text style={[styles.heroTitle, isTabletPortrait && styles.heroTitleTabletP]}>What does your{'\n'}body need?</Text>
            <Text style={styles.heroBody}>Guided sessions for rest, focus, and deep cellular healing.</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={handleHeroPress} activeOpacity={0.82}>
              <Text style={styles.heroBtnText}>Start Session</Text>
            </TouchableOpacity>
          </View>

          <SectionLabel title="Choose your frequency" />
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity key={a.id} style={styles.quickCard} activeOpacity={0.78} onPress={() => handleQuickAction(a)}>
                <View style={styles.quickBar} />
                <Text style={styles.quickIcon}>{a.icon}</Text>
                <Text style={styles.quickName}>{a.title}</Text>
                <Text style={styles.quickDesc}>{a.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!isTabletLandscape && <View style={styles.rule} />}
        </View>

        {/* Right column: popular + newest + browse */}
        <View style={isTabletLandscape ? styles.tabletRight : undefined}>
          <SectionLabel title="Popular" />
          {loading ? (
            <View style={styles.trackList}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.trackCard}>
                  <SkeletonBox width={40} height={40} borderRadius={999} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <SkeletonBox width="70%" height={14} />
                    <SkeletonBox width="40%" height={10} />
                  </View>
                </View>
              ))}
            </View>
          ) : error ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={handleRetry} activeOpacity={0.8}>
                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : popularTracks.length === 0 ? (
            <View style={styles.empty}><Text style={styles.emptyText}>No tracks yet.</Text></View>
          ) : (
            <View style={styles.trackList}>
              {popularTracks.map((t, i) => renderTrack(t, popularTracks, i === 0 ? 'Top' : undefined))}
            </View>
          )}
          <View style={styles.rule} />

          <SectionLabel title="Newest" />
          {loading ? (
            <View style={styles.trackList}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.trackCard}>
                  <SkeletonBox width={40} height={40} borderRadius={999} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <SkeletonBox width="70%" height={14} />
                    <SkeletonBox width="40%" height={10} />
                  </View>
                </View>
              ))}
            </View>
          ) : error ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={handleRetry} activeOpacity={0.8}>
                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : newestTracks.length === 0 ? (
            <View style={styles.empty}><Text style={styles.emptyText}>No tracks yet.</Text></View>
          ) : (
            <View style={styles.trackList}>
              {newestTracks.map((t) => renderTrack(t, newestTracks, 'New'))}
            </View>
          )}

          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/categories')} activeOpacity={0.75}>
            <Text style={styles.browseBtnText}>Browse all categories  →</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}

      <Text style={styles.wellnessFooter}>For wellness purposes only · Not medical advice</Text>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 68, paddingHorizontal: 22, backgroundColor: C.bg },
  glowTR: { position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: 999, backgroundColor: C.glowGold },
  glowML: { position: 'absolute', top: 420, left: -80, width: 200, height: 200, borderRadius: 999, backgroundColor: C.glowPurple },

  hero:     { alignItems: 'center', paddingBottom: 24 },
  eyebrow:  { fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: C.textMid, fontWeight: '400', marginBottom: 10 },
  logoMark: { fontSize: 60, fontWeight: '800', letterSpacing: -1, color: C.goldBright, lineHeight: 64 },
  logoSub:  { fontSize: 13, letterSpacing: 8, textTransform: 'uppercase', color: C.textMid, fontWeight: '300', marginBottom: 2 },
  logoFull: { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.textDim, fontWeight: '300', marginBottom: 12 },
  tagline:  { fontSize: 13, color: C.textMid, textAlign: 'center', fontWeight: '300', lineHeight: 20 },
  rule:     { height: 1, backgroundColor: C.borderGold, marginVertical: 20, marginHorizontal: 20 },

  searchInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.bgCardDeep, borderRadius: 14, borderWidth: 1, borderColor: C.borderGold,
    paddingHorizontal: 16, height: 48, marginBottom: 12,
  },
  searchIcon:  { fontSize: 16, color: C.textDim, fontWeight: '600' },
  searchInput: { flex: 1, fontSize: 14, color: C.textBright, fontWeight: '300', paddingVertical: 0 },
  searchClear: { fontSize: 13, color: C.textDim, fontWeight: '600', paddingHorizontal: 2 },

  filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  filterChip: {
    backgroundColor: C.bgCardDeep, borderWidth: 1, borderColor: C.borderPurple,
    borderRadius: 99, paddingVertical: 8, paddingHorizontal: 16,
  },
  filterChipActive: { backgroundColor: goldAlpha(0.10), borderColor: C.borderGold },
  filterChipText: { fontSize: 11, color: C.textDim, fontWeight: '500', letterSpacing: 0.5 },
  filterChipTextActive: { color: C.goldBright },

  heroCard:      { backgroundColor: C.bgHero, borderRadius: 24, padding: 24, marginBottom: 28, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden' },
  heroGlow:      { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 999, backgroundColor: goldAlpha(0.07) },
  heroBadgeRow:  { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  heroDot:       { width: 5, height: 5, borderRadius: 999, backgroundColor: C.goldBright },
  heroBadgeText: { fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: C.goldMid, fontWeight: '500' },
  heroTitle:     { fontSize: 26, fontWeight: '300', color: C.textBright, lineHeight: 34, marginBottom: 10 },
  heroBody:      { fontSize: 13, color: C.textMid, lineHeight: 21, fontWeight: '300', marginBottom: 22 },
  heroBtn:       { alignSelf: 'flex-start', backgroundColor: C.goldBright, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 28 },
  heroBtnText:   { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.bg, fontWeight: '700' },

  sectionLabelRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sectionLabelLine: { flex: 1, height: 1, backgroundColor: C.borderPurple },
  sectionLabelText: { fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: C.textMuted, fontWeight: '400' },

  quickGrid: { gap: 10, marginBottom: 24 },
  quickCard: { backgroundColor: C.bgCardDeep, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden' },
  quickBar:  { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: C.goldBright, opacity: 0.7 },
  quickIcon: { fontSize: 20, color: C.goldBright, marginBottom: 8 },
  quickName: { fontSize: 18, fontWeight: '600', color: C.textBright, marginBottom: 4 },
  quickDesc: { fontSize: 12, color: C.textMid, fontWeight: '300', lineHeight: 18 },

  trackList:      { marginBottom: 20 },
  trackCard:      { backgroundColor: C.bgCardDeep, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.borderGold, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, overflow: 'hidden' },
  trackAccent:    { position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, backgroundColor: C.goldBright, opacity: 0.6, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  trackIcon:      { width: 40, height: 40, borderRadius: 999, backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderGold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  trackIconText:  { fontSize: 16, color: C.goldBright },
  trackInfo:      { flex: 1 },
  trackName:      { fontSize: 14, fontWeight: '600', color: C.textBright, marginBottom: 3 },
  trackCat:       { fontSize: 9, color: C.textMuted, letterSpacing: 3, fontWeight: '400' },
  trackBadge:     { backgroundColor: goldAlpha(0.10), borderWidth: 1, borderColor: C.borderGold, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  trackBadgeText: { fontSize: 9, color: C.goldBright, letterSpacing: 2, fontWeight: '600' },

  empty:     { backgroundColor: C.bgCardDeep, borderRadius: 18, padding: 24, borderWidth: 1, borderColor: C.borderPurple, alignItems: 'center', marginBottom: 20 },
  emptyText: { fontSize: 12, color: C.textMuted, letterSpacing: 2, fontWeight: '300' },
  retryBtn:     { marginTop: 14, borderWidth: 1, borderColor: C.borderGold, borderRadius: 99, paddingVertical: 10, paddingHorizontal: 22, backgroundColor: goldAlpha(0.06) },
  retryBtnText: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.goldBright, fontWeight: '600' },

  browseBtn:     { borderWidth: 1, borderColor: C.borderGold, borderRadius: 99, paddingVertical: 16, alignItems: 'center', marginTop: 8, backgroundColor: goldAlpha(0.04) },
  browseBtnText: { fontSize: 11, color: C.goldBright, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },

  wellnessFooter: { fontSize: 10, color: C.textDim, textAlign: 'center', fontWeight: '300', opacity: 0.4, marginTop: 32 },

  containerTablet:        { paddingHorizontal: 40 },
  containerTabletPortrait: { paddingHorizontal: 60 },
  tabletRow:              { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  tabletLeft:             { flex: 1 },
  tabletRight:            { flex: 1 },
  logoMarkTabletP:        { fontSize: 74, lineHeight: 80 },
  taglineTabletP:         { fontSize: 15 },
  heroTitleTabletP:       { fontSize: 30 },
});