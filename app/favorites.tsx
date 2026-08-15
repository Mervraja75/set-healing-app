// =======================================
// SCREEN: Favorites (app/favorites.tsx)
// Day 102 — Saved tracks, meditations, chakras, elements & compositions
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link, useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackButton from '@/components/BackButton';
import FavoriteButton from '@/components/FavoriteButton';
import { SkeletonBox } from '@/components/SkeletonBox';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { usePlayer } from '@/context/PlayerContext';
import { useResponsive } from '@/hooks/useResponsive';
import { FavoriteRecord, FavoriteType } from '@/services/FavoritesService';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#0A0616',
  bgCard:       '#1A0D2E',
  bgCardDeep:   '#160A28',

  goldBright:   GOLD,
  goldMid:      GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   goldAlpha(0.15),
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.15)',
};

/* ---------------------------------------
   SECTION B — Group metadata
---------------------------------------- */
const GROUP_META: Record<FavoriteType, { label: string; icon: string; order: number }> = {
  track:       { label: 'Frequencies & Tracks', icon: '◐', order: 0 },
  meditation:  { label: 'Meditations',          icon: '◈', order: 1 },
  chakra:      { label: 'Chakras',              icon: '◉', order: 2 },
  element:     { label: 'Elements',             icon: '◆', order: 3 },
  composition: { label: 'Healing Music',        icon: '♪', order: 4 },
};

const sortByNewest = (a: FavoriteRecord, b: FavoriteRecord) =>
  (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);

/* ---------------------------------------
   SECTION C — Row
---------------------------------------- */
function FavoriteRow({ fav, onPress }: { fav: FavoriteRecord; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78} onPress={onPress}>
      <View style={[styles.cardAccent, { backgroundColor: fav.accentColor ?? GOLD }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTextBlock}>
          <Text style={styles.cardTitle} numberOfLines={1}>{fav.title}</Text>
          {fav.subtitle ? (
            <Text style={styles.cardSubtitle} numberOfLines={2}>{fav.subtitle}</Text>
          ) : null}
        </View>
        <FavoriteButton
          size="sm"
          item={{
            type: fav.type,
            itemId: fav.itemId,
            title: fav.title,
            subtitle: fav.subtitle,
            accentColor: fav.accentColor,
            sound: fav.sound,
            audioUrl: fav.audioUrl,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function FavoritesScreen() {
  const router = useRouter();
  const { isTabletPortrait } = useResponsive();
  const { isGuest } = useAuth();
  const { favorites, loading } = useFavorites();
  const { setPlaylist } = usePlayer();

  const groups = useMemo(() => {
    const byType = new Map<FavoriteType, FavoriteRecord[]>();
    for (const fav of favorites) {
      const list = byType.get(fav.type) ?? [];
      list.push(fav);
      byType.set(fav.type, list);
    }
    return Array.from(byType.entries())
      .map(([type, items]) => ({ type, items: items.sort(sortByNewest) }))
      .sort((a, b) => GROUP_META[a.type].order - GROUP_META[b.type].order);
  }, [favorites]);

  const handlePress = (fav: FavoriteRecord) => {
    setPlaylist(
      [{
        id: fav.itemId,
        title: fav.title,
        description: fav.subtitle ?? '',
        sound: fav.sound ?? 'calm',
        audioUrl: fav.audioUrl,
        favoriteType: fav.type,
        accentColor: fav.accentColor,
      }],
      0
    );
    router.push('/test');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isTabletPortrait && styles.containerTabletPortrait]}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowMidLeft} />

      <View style={styles.topBar}><BackButton /></View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Saved For You</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>Favorites</Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Everything you have saved, in one place
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── States ── */}
      {isGuest ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>Sign in to save and view your favorites.</Text>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.stateBtn} activeOpacity={0.85}>
              <Text style={styles.stateBtnText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : loading ? (
        <View style={styles.list}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.card}>
              <View style={{ flex: 1, padding: 18, gap: 8 }}>
                <SkeletonBox width="60%" height={14} />
                <SkeletonBox width="90%" height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>
            No favorites yet — tap the heart on any track or session to save it here.
          </Text>
        </View>
      ) : (
        groups.map((group) => (
          <View key={group.type} style={styles.groupSection}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>
                {GROUP_META[group.type].icon}  {GROUP_META[group.type].label}
              </Text>
              <View style={styles.sectionLabelLine} />
            </View>
            <View style={styles.list}>
              {group.items.map((fav) => (
                <FavoriteRow key={fav.docId} fav={fav} onPress={() => handlePress(fav)} />
              ))}
            </View>
          </View>
        ))
      )}

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

/* ---------------------------------------
   STYLES
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: 68,
    paddingHorizontal: 22,
    backgroundColor: C.bg,
  },
  containerTabletPortrait: { paddingHorizontal: 60 },

  topBar: { position: 'absolute', top: 55, left: 18, zIndex: 10 },

  glowTopRight: {
    position: 'absolute', top: -60, right: -80, width: 240, height: 240,
    borderRadius: 999, backgroundColor: C.glowGold,
  },
  glowMidLeft: {
    position: 'absolute', top: 500, left: -80, width: 200, height: 200,
    borderRadius: 999, backgroundColor: C.glowPurple,
  },

  header: { alignItems: 'center', marginBottom: 20, marginTop: 12 },
  eyebrow: {
    fontSize: 9, letterSpacing: 5, textTransform: 'uppercase',
    color: C.textDim, fontWeight: '400', marginBottom: 8,
  },
  title: {
    fontSize: 36, fontWeight: '700', color: C.textBright,
    letterSpacing: -0.5, marginBottom: 8,
  },
  titleTabletP: { fontSize: 44 },
  subtitle: {
    fontSize: 13, color: C.textMid, textAlign: 'center',
    fontWeight: '300', lineHeight: 20,
  },
  subtitleTabletP: { fontSize: 15 },

  goldRule: { height: 1, backgroundColor: C.borderGold, marginVertical: 20, marginHorizontal: 20 },

  stateBox: {
    backgroundColor: C.bgCardDeep, borderRadius: 16, paddingVertical: 24,
    paddingHorizontal: 20, borderWidth: 1, borderColor: C.borderPurple,
    alignItems: 'center', gap: 14,
  },
  stateText: {
    fontSize: 13, color: C.textMuted, fontWeight: '300',
    lineHeight: 20, textAlign: 'center',
  },
  stateBtn: {
    backgroundColor: C.goldBright, borderRadius: 99,
    paddingVertical: 12, paddingHorizontal: 28,
  },
  stateBtnText: {
    fontSize: 12, fontWeight: '700', color: C.bg,
    letterSpacing: 2, textTransform: 'uppercase',
  },

  groupSection: { marginBottom: 8 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sectionLabelLine: { flex: 1, height: 1, backgroundColor: C.borderPurple },
  sectionLabelText: {
    fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
    color: C.textMuted, fontWeight: '400',
  },

  list: { gap: 10, marginBottom: 24 },

  card: {
    flexDirection: 'row', backgroundColor: C.bgCardDeep, borderRadius: 18,
    borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden',
  },
  cardAccent: { width: 3, alignSelf: 'stretch', opacity: 0.85 },
  cardBody: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
  },
  cardTextBlock: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.textBright, marginBottom: 3 },
  cardSubtitle: { fontSize: 12, color: C.textMid, fontWeight: '300', lineHeight: 17 },
});
