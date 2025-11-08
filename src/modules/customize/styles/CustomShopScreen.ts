import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../../utils/scalers';
import {
    BACKGROUND_COLORS,
    TEXT_COLORS,
    UI_COLORS,
    PRIMARY_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(16),
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    headerTitle: {
        color: TEXT_COLORS.CAPTION_LIGHTER,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(12),
    },
    section: {
        paddingHorizontal: scale(8),
        paddingVertical: scale(12),
        gap: scale(12),
    },
    nav: {
        flexDirection: 'row',
        gap: scale(8),
    },
    navText: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.SUBTITLE,
    },
    sectionTitle: {
        color: TEXT_COLORS.DEFAULT,
        fontSize: scale(16),
        fontWeight: '600',
        marginBottom: verticalScale(16),
    },
    card: {
        padding: scale(8),
        gap: scale(16),
        borderRadius: scale(8),
        backgroundColor: UI_COLORS.BACKGROUND,
    },
    badge: {
        borderRadius: scale(16),
        height: scale(20),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        borderColor: TEXT_COLORS.CAPTION_LIGHTER,
        borderWidth: scale(1),
    },
    badgeText: {
        textAlign: 'center',
        color: TEXT_COLORS.CAPTION_LIGHTER,
        ...TYPOGRAPHY.CAPTION_2,
    },
    coinWrapper: {
        flexDirection: 'row',
        gap: scale(4),
    },
    priceText: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    buyText: {
        justifyContent: 'center',
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    buyButton: {
        flex: 1,
        alignItems: 'center',
        padding: scale(12),
        borderRadius: scale(8),
        backgroundColor: PRIMARY_COLORS.DEFAULT,
    },
    scrollContent: {
        gap: scale(12),
    },
    itemWrapper: {
        flexDirection: 'row',
        gap: scale(16),
        alignItems: 'center',
    },
    itemWrapperCentered: {
        flexDirection: 'row',
        gap: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemHeader: {
        flexDirection: 'row',
    },
    sectionFooter: {
        height: verticalScale(2),
        backgroundColor: UI_COLORS.BACKGROUND,
    },
    // 칭호 배지 스타일
    titleBadge: {
        borderRadius: scale(16),
        height: scale(28),
        paddingLeft: scale(12),
        paddingRight: scale(12),
        paddingTop: scale(4),
        paddingBottom: scale(4),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        borderWidth: scale(1.5),
    },
    titleBadgeText: {
        ...TYPOGRAPHY.BODY_1,
        fontWeight: '600',
    },
    // 플레이어 원형 스타일
    playerCircle: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
    },
    // 미스터리 배지 스타일
    mysteryBadge: {
        borderRadius: scale(16),
        height: scale(28),
        paddingLeft: scale(12),
        paddingRight: scale(12),
        paddingTop: scale(4),
        paddingBottom: scale(4),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        borderColor: TEXT_COLORS.CAPTION_LIGHTER,
        borderWidth: scale(1),
        backgroundColor: 'transparent',
    },
    mysteryText: {
        color: TEXT_COLORS.CAPTION_LIGHTER,
        ...TYPOGRAPHY.BODY_1,
        fontWeight: '600',
    },
    equippedButton: {
        backgroundColor: 'transparent',
        borderWidth: scale(1.5),
        borderColor: TEXT_COLORS.CAPTION,
    },
    equippedButtonText: {
        color: TEXT_COLORS.CAPTION,
    },
    disabledButton: {
        backgroundColor: 'transparent',
        borderWidth: scale(1.5),
        borderColor: TEXT_COLORS.CAPTION,
    },
    disabledButtonText: {
        color: TEXT_COLORS.CAPTION,
    },
});
