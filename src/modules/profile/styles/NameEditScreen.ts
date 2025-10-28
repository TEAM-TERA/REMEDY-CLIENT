import { StyleSheet } from 'react-native';
import {
    PRIMARY_COLORS,
    BACKGROUND_COLORS,
    UI_COLORS,
    TEXT_COLORS,
} from '../../../constants/colors';
import { scale, verticalScale } from '../../../utils/scalers';
import { TYPOGRAPHY } from '../../../constants/typography';

export const styles= StyleSheet.create({
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightComponent: {
        width: scale(24),
    },
    title: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    backButton: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    nameEditContainer: {
        padding: scale(12),
        gap: 12,
    },
    nameEditInput: {
        padding: scale(12),
        borderRadius: verticalScale(8),
        backgroundColor: UI_COLORS.BACKGROUND,
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.INPUT_TEXT,
    },
    button: {
        margin: verticalScale(12),
        padding: scale(12),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: verticalScale(8),
        backgroundColor: PRIMARY_COLORS.MINUS_TEN,
    },
    buttonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BUTTON_TEXT,
    },
});
