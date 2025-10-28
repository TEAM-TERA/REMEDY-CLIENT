import { StyleSheet } from 'react-native';
import {
    PRIMARY_COLORS,
    BACKGROUND_COLORS,
    UI_COLORS,
    TEXT_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale, verticalScale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        gap: 24,
    },
    profileImage: {
        width: scale(100),
        height: scale(100),
        borderRadius: 50,
        alignSelf: 'center',
    },
    profileContainer: {
        padding: scale(12),
        gap: 12,
    },
    aliasContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(4),
        borderRadius: verticalScale(16),
        backgroundColor: UI_COLORS.BACKGROUND_RED,
        color: TEXT_COLORS.CAPTION_RED,
    },
    aliasText: {
        color: TEXT_COLORS.CAPTION_RED,
        ...TYPOGRAPHY.CAPTION_2,
    },
    profileNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingLeft: scale(24),
        margin: 'auto',
    },
    userNameText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.HEADLINE_2,
    },
    nav: {
        flexDirection: 'row',
        gap: scale(12),
    },
    navText: {
        color: TEXT_COLORS.CAPTION,
        ...TYPOGRAPHY.SUBTITLE,
    },
    navTextActive: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    dropBox: {
        borderRadius: verticalScale(8),
        backgroundColor: UI_COLORS.BACKGROUND_RED,
    },
    dropBoxFrame: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: scale(12),
    },
    dropMusic: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
  tabContainer: {
    flex: 1,
    gap: scale(12),
  },
  listContent: {
    gap: scale(12),
    paddingBottom: verticalScale(24),
  },
    albumImage: {
        width: scale(100),
        height: scale(100),
        borderRadius: verticalScale(8),
        zIndex: 2,
        backgroundColor: PRIMARY_COLORS.MINUS_TWENTY,
        shadowColor: '#000',
        shadowOffset: { width: scale(3), height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: verticalScale(4),
    },
    albumDisk: {
        position: 'absolute',
        width: scale(80),
        height: scale(80),
        alignItems: 'center',
        justifyContent: 'center',
        left: scale(56),
        borderRadius: verticalScale(40),
        zIndex: 1,
        backgroundColor: PRIMARY_COLORS.DEFAULT,
        shadowColor: PRIMARY_COLORS.MINUS_TEN,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
    },
    albumDiskSmall: {
        width: scale(30),
        height: scale(30),
        borderRadius: verticalScale(30),
        backgroundColor: TEXT_COLORS.DEFAULT,
    },
    memoContainer: {
        flex: 1,
        gap: scale(8),
        paddingRight: scale(12),
        marginLeft: scale(40),
    },
    memoText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(2),
    },
    locationText: {
        color: PRIMARY_COLORS.PLUS_TWENTY,
        ...TYPOGRAPHY.CAPTION_2,
    },
    heartOverlay: {
        position: 'absolute',
        top: scale(0),
        left: scale(0),
        right: scale(0),
        bottom: scale(0),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        elevation: scale(10),
    },
  scrollView: {
    flex: 1,
  },
});
