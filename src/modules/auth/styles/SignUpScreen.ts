import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalers';
import { PRIMARY_COLORS, TEXT_COLORS, UI_COLORS, BACKGROUND_COLORS, FORM_COLORS } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    flex: 1,
    padding : scale(16),
    gap: scale(24),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  innerContainer: {
    flex : 1,
    width : "100%",
    paddingVertical : scale(36),
    paddingHorizontal : scale(12),
    gap: scale(24),
    borderRadius : scale(20),
    backgroundColor : FORM_COLORS.BACKGROUND_3,
  },
  formContainer: {
    padding: scale(12),
    gap: scale(24),
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
    color: TEXT_COLORS.BUTTON,
  },
  genderButtonTextInactive: {
    color: TEXT_COLORS.BUTTON,
  },
  signUpButton: {
    marginTop: scale(32),
    backgroundColor: PRIMARY_COLORS.DEFAULT,
    borderColor: PRIMARY_COLORS.DEFAULT,
  },
});
