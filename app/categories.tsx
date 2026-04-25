// =======================================
// SCREEN: Categories (app/(tabs)/categories.tsx)
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { usePlayer } from '@/context/PlayerContext';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

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

  glowGold:     'rgba(212, 168, 40, 0.08)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',
};

/* ---------------------------------------
   SECTION B — Types
---------------------------------------- */
type Category = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Track = {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  isPremium?: boolean;
  createdAt?: any;
};

/* ---------------------------------------
   SECTION C — Static categories
---------------------------------------- */
const CATEGORIES: Category[] = [
  { id: 'sleep',  title: 'Sleep',  description: 'Slow frequencies for rest and deep sleep',  icon: '◐' },
  { id: 'calm',   title: 'Calm',   description: 'Relaxing sounds to ease the mind',           icon: '◎' },
  { id: 'focus',  title: 'Focus',  description: 'Frequencies to support concentration',       icon: '◈' },
  { id: 'energy', title: 'Energy', description: 'Uplifting tones for alertness',              icon: '◆' },
];

/* ---------------------------------------
   SECTION D — Helpers
---------------------------------------- */
const getTrackSortValue = (track: Track) => track.createdAt?.seconds ?? 0;

/* ---------------------------------------
   SECTION E — Screen Component
---------------------------------------- */
export default function CategoriesScreen() {
  const { setLastCategory } = usePlayer();

  const [tracks, setTracks]   = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const snapshot = await getDocs(collection(db, 'tracks'));
        const items: Track[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Track, 'id'>),
        }));
        if (mounted) setTracks(items);
      } catch (err) {
        console.error('Failed to load tracks:', err);
        if (mounted) setError('Could not load uploaded tracks.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTracks();
    return () => { mounted = false; };
  }, []);

  const tracksByCategory = useMemo(() => {
    const grouped: Record<string, Track[]> = {};
    for (const track of tracks) {
      if (!grouped[track.category]) grouped[track.category] = [];
      grouped[track.category].push(track);
    }
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => getTrackSortValue(b) - getTrackSortValue(a));
    });
    return grouped;
  }, [tracks]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Sound Energy Therapy</Text>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>
          Browse healing tracks by frequency type
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── State boxes ── */}
      {loading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>Attuning frequencies…</Text>
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : null}

      {/* ── Category cards ── */}
      <View style={styles.categoryList}>
        {CATEGORIES.map((category) => {
          const categoryTracks = tracksByCategory[category.id] ?? [];
          const latestTrack    = categoryTracks[0];
          const trackCount     = categoryTracks.length;

          const targetTitle  = latestTrack?.title ?? category.title;
          const targetDesc   = latestTrack?.description ?? category.description;
          const targetAudio  = latestTrack?.url;

          return (
            <Link
              key={category.id}
              href={{
                pathname: '/test',
                params: {
                  title: targetTitle,
                  description: targetDesc,
                  sound: category.id,
                  audioUrl: targetAudio,
                },
              }}
              asChild
            >
              <Pressable
                style={({ pressed }) => [
                  styles.categoryCard,
                  pressed && styles.categoryCardPressed,
                ]}
                onPress={() => setLastCategory(category.title)}
                accessibilityRole="button"
                accessibilityLabel={`${category.title}. ${targetDesc}`}
              >
                {/* Gold top bar */}
                <View style={styles.categoryCardBar} />

                <View style={styles.categoryCardInner}>
                  {/* Left: icon + track count */}
                  <View style={styles.categoryLeft}>
                    <View style={styles.categoryIconWrap}>
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                    </View>
                    <View style={styles.trackCountBadge}>
                      <Text style={styles.trackCountText}>
                        {trackCount > 0
                          ? `${trackCount} track${trackCount === 1 ? '' : 's'}`
                          : 'No tracks'}
                      </Text>
                    </View>
                  </View>

                  {/* Middle: text */}
                  <View style={styles.categoryTextBlock}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDesc}>{targetDesc}</Text>
                    {latestTrack ? (
                      <Text style={styles.categoryLatest}>
                        Latest: {latestTrack.title}
                      </Text>
                    ) : (
                      <Text style={styles.categoryLatest}>
                        No uploaded tracks yet
                      </Text>
                    )}
                  </View>

                  {/* Right: arrow */}
                  <Text style={styles.categoryArrow}>›</Text>
                </View>
              </Pressable>
            </Link>
          );
        })}
      </View>

      {/* ── Footer note ── */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          New sessions added regularly
        </Text>
        <View style={styles.footerLine} />
      </View>

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

  glowTopRight: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: C.glowGold,
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: C.glowPurple,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '400',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMid,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 20,
  },

  goldRule: {
    height: 1,
    backgroundColor: C.borderGold,
    marginVertical: 20,
    marginHorizontal: 20,
  },

  // State
  stateBox: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: C.borderPurple,
    marginBottom: 16,
    alignItems: 'center',
  },
  stateText: {
    fontSize: 12,
    color: C.textMuted,
    letterSpacing: 2,
    fontWeight: '300',
  },

  // Category list
  categoryList: {
    gap: 14,
  },

  categoryCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  categoryCardPressed: {
    opacity: 0.78,
  },
  categoryCardBar: {
    height: 2,
    backgroundColor: C.goldBright,
    opacity: 0.5,
  },
  categoryCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },

  // Left column
  categoryLeft: {
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  categoryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: C.bgHero,
    borderWidth: 1,
    borderColor: C.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 22,
    color: C.goldBright,
  },
  trackCountBadge: {
    backgroundColor: 'rgba(212,168,40,0.10)',
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trackCountText: {
    fontSize: 9,
    color: C.goldBright,
    letterSpacing: 1,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Text block
  categoryTextBlock: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.textBright,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  categoryDesc: {
    fontSize: 12,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 18,
    marginBottom: 5,
  },
  categoryLatest: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '300',
    letterSpacing: 0.3,
  },

  // Arrow
  categoryArrow: {
    fontSize: 26,
    color: C.textDim,
    fontWeight: '300',
    flexShrink: 0,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginHorizontal: 20,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  footerText: {
    fontSize: 9,
    color: C.textDim,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '300',
  },
});