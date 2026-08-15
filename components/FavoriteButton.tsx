// =======================================
// COMPONENT: FavoriteButton
// Heart toggle — saves/removes per-user favorites in Firestore.
// Guests are prompted to sign in instead of writing anonymously.
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { GOLD, goldAlpha } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { memo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { FavoriteInput } from '@/services/FavoritesService';

type Props = {
  item: FavoriteInput;
  size?: 'sm' | 'md';
};

export default memo(function FavoriteButton({ item, size = 'md' }: Props) {
  const router = useRouter();
  const { isGuest } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);

  const favorited = !isGuest && isFavorited(item.type, item.itemId);

  const handlePress = () => {
    if (isGuest) {
      Alert.alert(
        'Sign in to save favorites',
        'Create a free account or sign in to save your favorite sessions.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') },
        ]
      );
      return;
    }
    if (busy) return;
    setBusy(true);
    toggleFavorite(item)
      .catch(() => {
        Alert.alert('Something went wrong', 'Could not update your favorites. Please try again.');
      })
      .finally(() => setBusy(false));
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.7}
      style={[styles.btn, size === 'sm' && styles.btnSm, favorited && styles.btnActive]}
      accessibilityRole="button"
      accessibilityLabel={favorited ? `Remove ${item.title} from favorites` : `Save ${item.title} to favorites`}
    >
      <Text style={[styles.icon, size === 'sm' && styles.iconSm, favorited && styles.iconActive]}>
        {favorited ? '♥' : '♡'}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: goldAlpha(0.15),
    flexShrink: 0,
  },
  btnSm: { width: 30, height: 30 },
  btnActive: {
    backgroundColor: goldAlpha(0.12),
    borderColor: goldAlpha(0.35),
  },
  icon:       { fontSize: 17, color: '#7A60A0', lineHeight: 19 },
  iconSm:     { fontSize: 14, lineHeight: 16 },
  iconActive: { color: GOLD },
});
