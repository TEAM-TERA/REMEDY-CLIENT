import { StyleSheet } from 'react-native';
import {
  BACKGROUND_COLORS,
  TEXT_COLORS,
  PRIMARY_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    padding: scale(16),
    gap: 24,
  },
  section: {
    padding: scale(12),
    gap: 8,
  },
  sectionTitle: {
    color: TEXT_COLORS.DEFAULT,
    ...TYPOGRAPHY.SUBTITLE,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(12),
  },
  settingItemText: {
    color: TEXT_COLORS.DEFAULT,
    ...TYPOGRAPHY.BODY_2,
  },
  destructiveText: {
    color: PRIMARY_COLORS.DEFAULT,
  },

  rightText: {
    color: TEXT_COLORS.CAPTION,
    ...TYPOGRAPHY.BODY_2,
  },
});