import { StyleSheet } from 'react-native';
import {
    PRIMARY_COLORS,
    BACKGROUND_COLORS,
    UI_COLORS,
    TEXT_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { verticalScale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    innerContainer: {
        gap: scale(24),
    },
    content: {
        flex: 1,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        gap: scale(12),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    infoTextWrapper: {
        gap: scale(4),
    },
    title: {
        fontWeight: 'bold',
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.HEADLINE_1,
    },
    artist: {
        color: PRIMARY_COLORS.PLUS_TEN,
        ...TYPOGRAPHY.SUBTITLE,
    },
    likeCommentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    smallLikeCommentRow: {
        flexDirection: 'row',
        gap: scale(4),
    },
    likeCommentText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    inner: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        gap: scale(12),
    },
    userRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        gap: scale(8),
    },
    userDot: {
        width: scale(20),
        height: scale(20),
        borderRadius: verticalScale(10),
        backgroundColor: PRIMARY_COLORS.DEFAULT,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    userName: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    userBadge: {
        alignItems: 'center',
        borderRadius: verticalScale(16),
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderWidth: scale(1),
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
        borderColor: TEXT_COLORS.CAPTION_LIGHTER,
    },
    userBadgeText: {
        color: TEXT_COLORS.CAPTION_LIGHTER,
        ...TYPOGRAPHY.CAPTION_2,
    },
    messageLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    messageBox: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: verticalScale(12),
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        gap: scale(8),
    },

    messageText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_2,
    },
    messageLocation: {
        color: PRIMARY_COLORS.PLUS_TEN,
        ...TYPOGRAPHY.CAPTION_1,
    },
    commentSection: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        gap: scale(12),
    },
    commentTitle: {
        color: TEXT_COLORS.DEFAULT,
        fontWeight: 'bold',
        ...TYPOGRAPHY.SUBTITLE,
    },
    commentInputRow: {
        flexDirection: 'row',
        gap: scale(8),
    },
    commentItemInfo: {
        flexDirection: 'row',
        gap: scale(8),
    },
    commentInput: {
        flex: 1,
        backgroundColor: UI_COLORS.BACKGROUND_RED,
        borderRadius: verticalScale(8),
        paddingHorizontal: scale(12),
        color: TEXT_COLORS.DEFAULT,
        height: verticalScale(40),
    },
    commentButton: {
        backgroundColor: PRIMARY_COLORS.DEFAULT,
        borderRadius: verticalScale(8),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(18),
    },

    commentButtonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BUTTON_TEXT,
    },
    commentItemWrapper: {
        backgroundColor: UI_COLORS.BACKGROUND_RED,
        borderRadius: verticalScale(12),
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        gap: scale(8),
        marginBottom: verticalScale(12),
    },
    commentItemDot: {
        width: scale(10),
        height: scale(10),
        borderRadius: verticalScale(5),
    },
    commentItemUser: {
        fontWeight: 'bold',
    },
    commentItemBox: {
        borderRadius: verticalScale(8),
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(6),
        flex: 1,
    },
    commentItemText: {
        color: PRIMARY_COLORS.PLUS_TEN,
        ...TYPOGRAPHY.BODY_2,
    },
});
