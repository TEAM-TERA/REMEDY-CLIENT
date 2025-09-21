import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/scalers';
import { TEXT_COLORS, BACKGROUND_COLORS, PRIMARY_COLORS } from '../../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    left: scale(1),
    right: scale(1),
    zIndex: 1000,
  }, 
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: scale(6),
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: scale(6),
    alignSelf: 'stretch',
  },
  statItem: {
    display: 'flex',
    height: scale(44),
    flexDirection: 'row',
    padding: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    borderRadius: scale(16),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
  },
  iconContainer: {
    marginRight: scale(0.3),
  },
  icon: {
    fontSize: scale(1.2),
  },
  statText: {
    color: PRIMARY_COLORS.DEFAULT,
  },
  divider: {
    width: 1,
    height: scale(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: scale(0.8),
  },
});
