import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalers';
import { BACKGROUND_COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  bottomContainer: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(12),
    gap: scale(24),
  },
  buttonContainer: {
    width: '100%',
  },
});
