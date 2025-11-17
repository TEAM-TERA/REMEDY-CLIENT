import { StyleSheet } from 'react-native';
import {
    BACKGROUND_COLORS,
    TEXT_COLORS,
    PRIMARY_COLORS,
    UI_COLORS,
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
        padding: scale(16),
        gap: scale(24),
    },
    content: {
        gap: scale(32),
    },
    inputContainer: {
        padding: scale(12),
        gap: scale(12),
    },
    label: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    textInput: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: verticalScale(8),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    dateInput: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: verticalScale(8),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateInputContainer: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: verticalScale(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTextInput: {
        flex: 1,
        paddingLeft: scale(16),
        paddingVertical: verticalScale(16),
        paddingRight: scale(12),
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    calendarButton: {
        paddingRight: scale(12),
        paddingLeft: scale(12),
        paddingVertical: verticalScale(16),
    },
    dateText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    genderContainer: {
        padding: scale(12),
        gap: scale(12),
    },
    genderButtons: {
        flexDirection: 'row',
        gap: scale(8),
    },
    genderButton: {
        flex: 1,
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: verticalScale(8),
        padding: scale(12),
        alignItems: 'center',
    },
    genderButtonSelected: {
        backgroundColor: PRIMARY_COLORS.MINUS_TEN,
    },
    genderButtonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BUTTON_TEXT,
    },
    genderButtonTextSelected: {
        color: TEXT_COLORS.DEFAULT,
    },
    submitButton: {
        backgroundColor: PRIMARY_COLORS.MINUS_TEN,
        borderRadius: verticalScale(8),
        padding: scale(12),
        margin: scale(12),
        alignItems: 'center',
    },
    submitButtonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
});

