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
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: scale(16),
        paddingVertical: scale(8),
        gap: scale(16),
    },
    // Header
    header: {
        flexDirection: 'column',
        gap: 0,
        width: '100%',
    },
    backButton: {
        width: scale(24),
        height: scale(24),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(4),
    },
    cdPlayerSection: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: verticalScale(-30),
        paddingVertical: verticalScale(5),
    },
    musicInfoSection: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        gap: scale(16),
        borderRadius: scale(12),
    },
    titleSection: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        gap: scale(10),
        alignItems: 'center',
        width: '100%',
    },
    title: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.HEADLINE_1,
        lineHeight: scale(40),
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: scale(319),
    },
    artist: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_2,
    },
    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: scale(8),
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        flexDirection: 'row',
        gap: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        ...TYPOGRAPHY.CAPTION_2,
        lineHeight: scale(16),
    },
    likeButtonText: {
        color: PRIMARY_COLORS.DEFAULT,
    },
    saveButtonText: {
        color: '#EF9210',
    },
    // Progress Bar Section
    progressSection: {
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: '100%',
    },
    progressSlider: {
        flex: 1,
    },
    timeText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.CAPTION_3,
        lineHeight: scale(16),
    },
    progressContainer: {
        flex: 1,
        height: scale(10),
    },
    playControlsSection: {
        flexDirection: 'row',
        gap: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    skipButton: {
        width: scale(36),
        height: scale(36),
        alignItems: 'center',
        justifyContent: 'center',
    },
    playPauseButton: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: TEXT_COLORS.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userLocationSection: {
        paddingHorizontal: 0,
        paddingVertical: scale(8),
        gap: scale(10),
        width: '100%',
    },
    userInfoRow: {
        flexDirection: 'column',
        gap: scale(8),
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
    },
    userCard: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderColor: UI_COLORS.STROKE || '#27273a',
        borderWidth: 1,
        borderRadius: scale(24),
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
        paddingHorizontal: scale(12),
        paddingVertical: scale(4),
    },
    userDot: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: PRIMARY_COLORS.DEFAULT,
    },
    userName: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
        lineHeight: scale(24),
    },
    locationRow: {
        flexDirection: 'row',
        gap: scale(4),
        alignItems: 'center',
        paddingHorizontal: scale(8),
        paddingVertical: 0,
        width: '100%',
    },
    locationIcon: {
        width: scale(24),
        height: scale(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationTag: {
        backgroundColor: UI_COLORS.INPUT_1 || '#212131',
        borderColor: UI_COLORS.STROKE || '#27273a',
        borderWidth: 1,
        borderRadius: scale(24),
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        flexDirection: 'row',
        gap: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationTagText: {
        color: PRIMARY_COLORS.PLUS_TEN,
        ...TYPOGRAPHY.CAPTION_2,
        lineHeight: scale(16),
    },
    // Message Section
    messageSection: {
        paddingHorizontal: scale(8),
        paddingVertical: 0,
        width: '100%',
    },
    messageContainer: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderColor: UI_COLORS.STROKE || '#27273a',
        borderWidth: 1,
        borderRadius: scale(12),
        width: '100%',
    },
    messageContent: {
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
        gap: scale(12),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    messageText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
        lineHeight: scale(22),
    },
});
