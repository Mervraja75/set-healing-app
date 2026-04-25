// =======================================
// SCREEN: Healing (app/(tabs)/healing.tsx)
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { usePlayer } from '@/context/PlayerContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

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
type Collection = {
  id: string;
  title: string;
  description: string;
  sound: string;
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
   SECTION C — Static data
---------------------------------------- */
const FEATURED_FALLBACK = {
  id: 'deep-sleep',
  title: 'Deep Sleep',
  description: 'Slow, grounding frequencies for deep rest and recovery',
  sound: 'sleep',
};

const COLLECTIONS: Collection[] = [
  { id: 'sleep',  title: 'Sleep',  description: 'Slow frequencies for rest and deep sleep', sound: 'sleep',  icon: '◐' },
  { id: 'calm',   title: 'Calm',   description: 'Ease your thoughts and slow down',          sound: 'calm',   icon: '◎' },
  { id: 'focus',  title: 'Focus',  description: 'Sharpen attention and clarity',             sound: 'focus',  icon: '◈' },
  { id: 'energy', title: 'Energy', description: 'Uplifting tones for alertness',             sound: 'energy', icon: '◆' },
];

/* ---------------------------------------
   SECTION D — Helpers
---------------------------------------- */
const getSortValue = (track: Track) => track.createdAt?.seconds ?? 0;

const groupTracksByCategory = (tracks: Track[]) => {
  const grouped: Record<string, Track[]> = {};
  for (const track of tracks) {
    if (!grouped[track.category]) grouped[track.category] = [];
    grouped[track.category].push(track);
  }
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => getSortValue(b) - getSortValue(a));
  });
  return grouped;
};

/* ---------------------------------------
   SECTION E — Screen Component
---------------------------------------- */
export default function HealingScreen() {
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
        const snap = await getDocs(query(collection(db, 'tracks')));
        const items: Track[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Track, 'id'>),
        }));
        if (mounted) setTracks(items);
      } catch (err) {
        console.error('Failed to load healing tracks:', err);
        if (mounted) setError('Could not load uploaded tracks.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTracks();
    return () => { mounted = false; };
  }, []);

  const groupedTracks = useMemo(() => groupTracksByCategory(tracks), [tracks]);
  const featuredTrack = groupedTracks.sleep?.[0] ?? tracks[0] ?? null;

  const renderPlayerLink = (
    title: string,
    description: string,
    sound: string,
    audioUrl?: string
  ) => (
    <Link
      href={{ pathname: '/test', params: { title, description, sound, audioUrl } }}
      asChild
    >
      <TouchableOpacity style={styles.featuredBtn} activeOpacity={0.85}>
        <Text style={styles.featuredBtnIcon}>▶</Text>
        <Text style={styles.featuredBtnText}>Play Session</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowMidLeft} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Sound Energy Therapy</Text>
        <Text style={styles.title}>Healing</Text>
        <Text style={styles.subtitle}>
          Curated collections to restore your mind and body
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

      {/* ── Featured Card ── */}
      <View style={styles.featuredCard}>
        <View style={styles.featuredCardGlow} />
        <View style={styles.featuredBadgeRow}>
          <View style={styles.featuredBadgeDot} />
          <Text style={styles.featuredBadgeText}>Featured Session</Text>
        </View>
        <Text style={styles.featuredTitle}>
          {featuredTrack?.title ?? FEATURED_FALLBACK.title}
        </Text>
        <Text style={styles.featuredBody}>
          {featuredTrack?.description ?? FEATURED_FALLBACK.description}
        </Text>
        {featuredTrack ? (
          featuredTrack.isPremium ? (
            <Link href="/paywall" asChild>
              <TouchableOpacity style={styles.unlockBtn} activeOpacity={0.85}>
                <Text style={styles.unlockBtnText}>🔒  Unlock Premium</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            renderPlayerLink(
              featuredTrack.title,
              featuredTrack.description ?? FEATURED_FALLBACK.description,
              featuredTrack.category,
              featuredTrack.url
            )
          )
        ) : (
          renderPlayerLink(
            FEATURED_FALLBACK.title,
            FEATURED_FALLBACK.description,
            FEATURED_FALLBACK.sound
          )
        )}
      </View>

      {/* ── Collections label ── */}
      <View style={styles.sectionLabelRow}>
        <View style={styles.sectionLabelLine} />
        <Text style={styles.sectionLabelText}>Collections</Text>
        <View style={styles.sectionLabelLine} />
      </View>

      {/* ── Collection cards ── */}
      <View style={styles.collectionList}>
        {COLLECTIONS.map((item) => {
          const latestTrack  = groupedTracks[item.id]?.[0];
          const displayTitle = latestTrack?.title ?? item.title;
          const displayDesc  = latestTrack?.description ?? item.description;
          const soundKey     = latestTrack?.category ?? item.sound;

          const Card = (
            <View style={styles.collectionCard}>
              <View style={styles.collectionCardBar} />
              <View style={styles.collectionCardInner}>
                <View style={styles.collectionIconWrap}>
                  <Text style={styles.collectionIcon}>{item.icon}</Text>
                </View>
                <View style={styles.collectionTextBlock}>
                  <View style={styles.collectionTitleRow}>
                    <Text style={styles.collectionTitle}>{item.title}</Text>
                    {latestTrack?.isPremium ? (
                      <Text style={styles.lockIcon}>🔒</Text>
                    ) : latestTrack ? (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.collectionDesc}>{displayDesc}</Text>
                  <Text style={styles.collectionLatest}>
                    {latestTrack
                      ? `Latest: ${latestTrack.title}`
                      : 'No uploaded tracks yet'}
                  </Text>
                </View>
                <Text style={styles.collectionArrow}>›</Text>
              </View>
            </View>
          );

          if (latestTrack?.isPremium) {
            return (
              <Link key={item.id} href="/paywall" asChild>
                <TouchableOpacity activeOpacity={0.78}>{Card}</TouchableOpacity>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={{
                pathname: '/test',
                params: {
                  title: displayTitle,
                  description: displayDesc,
                  sound: soundKey,
                  audioUrl: latestTrack?.url,
                },
              }}
              asChild
            >
              <TouchableOpacity activeOpacity={0.78}>{Card}</TouchableOpacity>
            </Link>
          );
        })}
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
  glowMidLeft: {
    position: 'absolute',
    top: 500,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: C.glowPurple,
  },

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

  featuredCard: {
    backgroundColor: C.bgHero,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  featuredCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(212,168,40,0.07)',
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
  },
  featuredBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: C.goldBright,
  },
  featuredBadgeText: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: C.goldMid,
    fontWeight: '500',
  },
  featuredTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: C.textBright,
    marginBottom: 10,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  featuredBody: {
    fontSize: 13,
    color: C.textMid,
    lineHeight: 21,
    fontWeight: '300',
    marginBottom: 22,
  },
  featuredBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  featuredBtnIcon: {
    fontSize: 12,
    color: C.bg,
    fontWeight: '800',
  },
  featuredBtnText: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.bg,
    fontWeight: '700',
  },
  unlockBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingVertical: 13,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(212,168,40,0.08)',
  },
  unlockBtnText: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.goldBright,
    fontWeight: '600',
  },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  sectionLabelText: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: '400',
  },

  collectionList: {
    gap: 12,
  },
  collectionCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  collectionCardBar: {
    height: 2,
    backgroundColor: C.goldBright,
    opacity: 0.5,
  },
  collectionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  collectionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: C.bgHero,
    borderWidth: 1,
    borderColor: C.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  collectionIcon: {
    fontSize: 20,
    color: C.goldBright,
  },
  collectionTextBlock: {
    flex: 1,
  },
  collectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  collectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  collectionDesc: {
    fontSize: 12,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 18,
    marginBottom: 5,
  },
  collectionLatest: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  collectionArrow: {
    fontSize: 24,
    color: C.textDim,
    fontWeight: '300',
    flexShrink: 0,
  },
  lockIcon: {
    fontSize: 13,
  },
  newBadge: {
    backgroundColor: 'rgba(212,168,40,0.10)',
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 9,
    color: C.goldBright,
    letterSpacing: 1,
    fontWeight: '600',
  },
});