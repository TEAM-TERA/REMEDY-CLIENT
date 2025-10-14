import { StyleSheet } from 'react-native';
import {
    TEXT_COLORS,
    PRIMARY_COLORS,
    UI_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

export const styles = StyleSheet.create({
    challengeContainer: {
        flexDirection: 'row',
    },
    sideBar: {
        width: 12,
        backgroundColor: PRIMARY_COLORS.DEFAULT,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    content: {
        flex: 1,
        gap: 4,
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: UI_COLORS.BACKGROUND_BLUE,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    challengeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    challengeTitleWrapper: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    challengeTitle: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    challengeCoinWrapper: {
        flexDirection: 'row',
        gap: 4,
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
        gap: 8,
    },
    progressBarWrapper: {
        flex: 1,
    },
    progressBar: {
        height: 6,
        backgroundColor: TEXT_COLORS.CAPTION,
        borderRadius: 3,
        marginVertical: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: PRIMARY_COLORS.DEFAULT,
    },
    detailText: {
        color: TEXT_COLORS.CAPTION_LIGHTER,
        ...TYPOGRAPHY.CAPTION_1,
    },
});
