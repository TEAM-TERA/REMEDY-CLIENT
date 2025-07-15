import { StyleSheet } from 'react-native';
import {
    BACKGROUND_COLORS,
    TEXT_COLORS,
    PRIMARY_COLORS,
    UI_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

const infoEditScreen = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    container: {
        flex: 1,
        padding: 16,
        gap: 24,
    },
    content: {
        gap: 32,
    },
    inputContainer: {
        padding: 12,
        gap: 12,
    },
    label: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    textInput: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    dateInput: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateInputContainer: {
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTextInput: {
        flex: 1,
        paddingLeft: 16,
        paddingVertical: 16,
        paddingRight: 12,
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    calendarButton: {
        paddingRight: 12,
        paddingLeft: 12,
        paddingVertical: 16,
    },
    dateText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    genderContainer: {
        padding: 12,
        gap: 12,
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    genderButton: {
        flex: 1,
        backgroundColor: UI_COLORS.BACKGROUND,
        borderRadius: 8,
        padding: 12,
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
        borderRadius: 8,
        padding: 12,
        margin: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
});

export default infoEditScreen;
