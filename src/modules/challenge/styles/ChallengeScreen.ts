import { StyleSheet } from 'react-native';
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { verticalScale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    container: {
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        gap: 24,
    },
    section: {
        flex: 1,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        gap: 12,
    },
    nav: {
        flexDirection: 'row',
        gap: scale(12),
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
        paddingVertical: verticalScale(40),
        alignItems: 'center',
    },
    emptyStateText: {
        color: TEXT_COLORS.CAPTION,
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: TEXT_COLORS.CAPTION,
    },
});
