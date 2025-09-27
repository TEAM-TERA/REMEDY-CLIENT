import { StyleSheet } from 'react-native';
import {
    PRIMARY_COLORS,
    BACKGROUND_COLORS,
    UI_COLORS,
    TEXT_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    innerContainer: {
        gap: 24,
    },
    content: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    infoTextWrapper: {
        gap: 4,
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
        gap: 12,
    },
    smallLikeCommentRow: {
        flexDirection: 'row',
        gap: 4,
    },
    likeCommentText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    inner: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
    },
    userRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        gap: 8,
    },
    userDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF1744',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    userName: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    userBadge: {
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        backgroundColor: '#232025',
        borderColor: TEXT_COLORS.CAPTION_LIGHTER,
    },
    userBadgeText: {
        color: TEXT_COLORS.CAPTION_LIGHTER,
        ...TYPOGRAPHY.CAPTION_2,
    },
    messageLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    messageBox: {
        backgroundColor: UI_COLORS.BACKGROUND_RED,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 8,
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
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
    },
    commentTitle: {
        color: TEXT_COLORS.DEFAULT,
        fontWeight: 'bold',
        ...TYPOGRAPHY.SUBTITLE,
    },
    commentInputRow: {
        flexDirection: 'row',
        gap: 8,
    },
    commentItemInfo: {
        flexDirection: 'row',
        gap: 8,
    },
    commentInput: {
        flex: 1,
        backgroundColor: UI_COLORS.BACKGROUND_RED,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: TEXT_COLORS.DEFAULT,
        height: 40,
    },
    commentButton: {
        backgroundColor: PRIMARY_COLORS.DEFAULT,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
    },

    commentButtonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BUTTON_TEXT,
    },
    commentItemWrapper: {
        backgroundColor: UI_COLORS.BACKGROUND_RED,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 8,
        marginBottom: 12,
    },
    commentItemDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    commentItemUser: {
        fontWeight: 'bold',
    },
    commentItemBox: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flex: 1,
    },
    commentItemText: {
        color: PRIMARY_COLORS.PLUS_TEN,
        ...TYPOGRAPHY.BODY_2,
    },
});
