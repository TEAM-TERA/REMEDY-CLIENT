import { StyleSheet } from 'react-native';
import { BACKGROUND_COLORS, TEXT_COLORS, UI_COLORS } from '../../../constants/colors';
import { scale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: scale(120),
    gap: scale(16),
  },
  card: {
    backgroundColor: UI_COLORS.BACKGROUND,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#2E2E40',
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
    flex: 1,
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
    backgroundColor: '#1F1F2B',
    borderColor: '#3A3A52',
  },
  headerTitle: {
    color: TEXT_COLORS.DEFAULT,
  },
  expandIcon: {
    color: TEXT_COLORS.CAPTION_LIGHTER,
  },
  divider: {
    height: 1,
    backgroundColor: '#2E2E40',
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
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: scale(16),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: '#2E2E40',
  },
  nextButton: {
    borderRadius: scale(12),
  },
});


