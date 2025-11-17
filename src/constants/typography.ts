import { FONTS } from './fonts';
import { fontScale } from '../utils/scalers';

export const TYPOGRAPHY = {
    HEADLINE_1: {
        fontSize: fontScale(32),
        lineHeight: 40,
        fontFamily: FONTS.BOLD,
    },
    HEADLINE_2: {
        fontSize: fontScale(24),
        lineHeight: 32,
        fontFamily: FONTS.BOLD,
    },
    HEADLINE_3: {
        fontSize: fontScale(20),
        lineHeight: 26,
        fontFamily: FONTS.BOLD,
    },
    SUBTITLE: {
        fontSize: fontScale(18),
        lineHeight: 24,
        fontFamily: FONTS.BOLD,
    },
    BODY_1: {
        fontSize: fontScale(16),
        lineHeight: 22,
        fontFamily: FONTS.BOLD,
    },
    BODY_2: {
        fontSize: fontScale(16),
        lineHeight: 22,
        fontFamily: FONTS.MEDIUM,
    },
    CAPTION_1: {
        fontSize: fontScale(14),
        lineHeight: 20,
        fontFamily: FONTS.MEDIUM,
    },
    CAPTION_2: {
        fontSize: fontScale(14),
        lineHeight: 16,
        fontFamily: FONTS.MEDIUM,
    },
    CAPTION_3: {
        fontSize: fontScale(12),
        lineHeight: 16,
        fontFamily: FONTS.MEDIUM,
    },
    BUTTON_TEXT: {
        fontSize: fontScale(16),
        lineHeight: 22,
        fontFamily: FONTS.BOLD,
    },
    INPUT_TEXT: {
        fontSize: fontScale(16),
        lineHeight: 22,
        fontFamily: FONTS.MEDIUM,
    },
}
