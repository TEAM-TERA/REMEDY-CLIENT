import { StyleSheet } from 'react-native';
import {
    TEXT_COLORS,
    PRIMARY_COLORS,
    UI_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { verticalScale } from '../../../utils/scalers';
export const styles = StyleSheet.create({
    challengeContainer: {
        flexDirection: 'row',
    },
    sideBar: {
        width: scale(12),
        backgroundColor: PRIMARY_COLORS.DEFAULT,
        borderTopLeftRadius: verticalScale(8),
        borderBottomLeftRadius: verticalScale(8),
    },
    content: {
        flex: 1,
        gap: 4,
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(12),
        backgroundColor: UI_COLORS.BACKGROUND_BLUE,
        borderTopRightRadius: verticalScale(8),
        borderBottomRightRadius: verticalScale(8),
    },
    challengeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    challengeTitleWrapper: {
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
    },
    challengeTitle: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    challengeCoinWrapper: {
        flexDirection: 'row',
        gap: scale(4),
        alignItems: 'center',
    },
    challengeCoinText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    challengeProgressWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    challengeProgressText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    progressBarWrapper: {
        flex: 1,
    },
    progressBar: {
        height: verticalScale(6),
        backgroundColor: TEXT_COLORS.CAPTION,
        borderRadius: verticalScale(3),
        marginVertical: verticalScale(8),
        overflow: 'hidden',
    },
    progressFill: {
        height: verticalScale(100),
        backgroundColor: PRIMARY_COLORS.DEFAULT,
    },
    detailText: {
        color: TEXT_COLORS.CAPTION_LIGHTER,
        ...TYPOGRAPHY.CAPTION_1,
    },
});
