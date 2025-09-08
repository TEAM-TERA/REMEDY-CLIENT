import { Platform, StyleSheet } from 'react-native';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { PRIMARY_COLORS } from '../../../../constants/colors';

export const DROP = PRIMARY_COLORS.MINUS_TEN
export const DROP_DIM = PRIMARY_COLORS.DEFAULT
export const SIZE = 140;
export const INNER = 120;

export const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: DROP,
        shadowOpacity: 0.45,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 18,
      },
      android: { elevation: 10 },
    }),
  },
  outer: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: DROP_DIM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    backgroundColor: DROP,
  },
  badge: {
    position: 'absolute',
    right: 40,
    bottom: 60,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: DROP,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize : 18,
    letterSpacing: 0.5,
  },
});