import { StyleSheet } from 'react-native';
import {
    PRIMARY_COLORS,
    BACKGROUND_COLORS,
    UI_COLORS,
    TEXT_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

const userProfileScreen = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 24,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
    },
    profileContainer: {
        padding: 12,
        gap: 12,
    },
    aliasContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
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
        paddingLeft: 24,
        margin: 'auto',
    },
    userNameText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.HEADLINE_2,
    },
    nav: {
        flexDirection: 'row',
        gap: 12,
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
        borderRadius: 8,
        backgroundColor: UI_COLORS.BACKGROUND_RED,
    },
    dropBoxFrame: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    dropMusic: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
  tabContainer: {
    flex: 1,
    gap: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
    albumImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        zIndex: 2,
        backgroundColor: PRIMARY_COLORS.MINUS_TWENTY,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    albumDisk: {
        position: 'absolute',
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        left: 56,
        borderRadius: 40,
        zIndex: 1,
        backgroundColor: PRIMARY_COLORS.DEFAULT,
        // iOS shadow
        shadowColor: PRIMARY_COLORS.MINUS_TEN,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
    },
    albumDiskSmall: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: TEXT_COLORS.DEFAULT,
    },
    memoContainer: {
        flex: 1,
        gap: 8,
        paddingRight: 12,
        marginLeft: 40,
    },
    memoText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    locationText: {
        color: PRIMARY_COLORS.PLUS_TWENTY,
        ...TYPOGRAPHY.CAPTION_2,
    },
    heartOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        elevation: 10,
    },
  scrollView: {
    flex: 1,
  },
});
export default userProfileScreen;
