import { StyleSheet } from 'react-native';
import {
    PRIMARY_COLORS,
    BACKGROUND_COLORS,
    UI_COLORS,
    TEXT_COLORS,
} from '../../../constants/colors';

import { TYPOGRAPHY } from '../../../constants/typography';

export const styles= StyleSheet.create({
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightComponent: {
        width: 24,
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
        padding: 12,
        gap: 12,
    },
    nameEditInput: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: UI_COLORS.BACKGROUND,
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.INPUT_TEXT,
    },
    button: {
        margin: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: PRIMARY_COLORS.MINUS_TEN,
    },
    buttonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BUTTON_TEXT,
    },
});
