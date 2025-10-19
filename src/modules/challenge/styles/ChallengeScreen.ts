import { StyleSheet } from 'react-native';
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    container: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 24,
    },
    section: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
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
    emptyStateContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        color: TEXT_COLORS.CAPTION,
    },
});
