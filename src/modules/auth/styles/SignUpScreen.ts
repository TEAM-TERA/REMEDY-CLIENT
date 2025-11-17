import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalers';
import { PRIMARY_COLORS, TEXT_COLORS, UI_COLORS, BACKGROUND_COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  formContainer: {
    paddingHorizontal: scale(24),
    paddingTop: scale(40),
    paddingBottom: scale(40),
    gap: scale(20),
  },
  genderContainer: {
    marginTop: scale(8),
  },
  genderLabel: {
    color: TEXT_COLORS.DEFAULT,
    marginBottom: scale(12),
  },
  genderButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  genderButton: {
    flex: 1,
    height: scale(48),
    borderRadius: scale(8),
  },
  genderButtonActive: {
    backgroundColor: PRIMARY_COLORS.DEFAULT,
    borderColor: PRIMARY_COLORS.DEFAULT,
  },
  genderButtonInactive: {
    backgroundColor: UI_COLORS.BACKGROUND,
    borderColor: UI_COLORS.BACKGROUND,
  },
  genderButtonTextActive: {
    color: TEXT_COLORS.DEFAULT,
  },
  genderButtonTextInactive: {
    color: TEXT_COLORS.DEFAULT,
  },
  signUpButton: {
    marginTop: scale(32),
    backgroundColor: PRIMARY_COLORS.DEFAULT,
    borderColor: PRIMARY_COLORS.DEFAULT,
  },
});
