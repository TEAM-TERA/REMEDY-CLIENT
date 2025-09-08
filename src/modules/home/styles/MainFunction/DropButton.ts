import { Platform, StyleSheet } from 'react-native';

export const DROP = '#FF2D55';
export const DROP_DIM = 'rgba(255,45,85,0.28)';
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
    right: 10,
    bottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: DROP,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});