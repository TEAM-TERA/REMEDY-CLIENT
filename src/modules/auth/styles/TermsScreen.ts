import { StyleSheet } from 'react-native';
import { BACKGROUND_COLORS, FORM_COLORS, TEXT_COLORS, UI_COLORS } from '../../../constants/colors';
import { scale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    flex: 1,
    gap: scale(24),
    padding: scale(16),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingBottom: scale(20),
    gap: scale(24),
  },
  termsList: {
    padding: scale(12),
    gap: scale(16),
  },
  card: {
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderRadius: scale(12),
    paddingVertical: scale(12),
  },
  cardHeader: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    marginRight: scale(10),
    borderWidth: 2,
  },
  checkCircleOn: {
    backgroundColor: '#F23F6F',
    borderColor: '#F23F6F',
  },
  checkCircleOff: {
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderColor: TEXT_COLORS.CAPTION_2,
  },
  headerTitle: {
    color: TEXT_COLORS.DEFAULT,
  },
  expandIcon: {
    color: TEXT_COLORS.CAPTION_2,
  },
  divider: {
    height: 2,
    backgroundColor: TEXT_COLORS.CAPTION_1,
    marginHorizontal: scale(16),
    marginVertical: scale(8),
  },
  content: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(8),
    gap: scale(6),
  },
  contentText: {
    color: TEXT_COLORS.DEFAULT,
  },
  requiredNotice: {
    color: '#F23F6F',
    marginTop: scale(8),
    paddingHorizontal: scale(16),
  },
  agreeButton: {
    marginTop: scale(8),
    marginHorizontal: scale(16),
    marginBottom: scale(8),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    backgroundColor: '#2A2A3A',
    borderWidth: 1,
    borderColor: '#3A3A52',
  },
  nextButton: {
    borderRadius: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    marginHorizontal: scale(12),
  },
});


