import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/scalers';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../../constants/colors';
import { TYPOGRAPHY } from '../../../../constants/typography';

export const styles = StyleSheet.create({
    nodeContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: scale(0.25),
        marginLeft: scale(1),
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: scale(0.1875),
        opacity: 0.4,
    },
    musicImg: {
        width: scale(64),
        height: scale(64),
        flexShrink: 0,
        borderRadius: scale(10),
    },
    subMusicImg: {
        width: scale(48),
        height: scale(48),
        flexShrink: 0,
        borderRadius: scale(10),
    },
    musicTitle: {
        color: PRIMARY_COLORS.DEFAULT,
        ...TYPOGRAPHY.BODY_1,
    },
    singerText: {
        color: PRIMARY_COLORS.PLUS_TWENTY,
        ...TYPOGRAPHY.CAPTION_2,
    },
    subMusicTitle: {
        color: TEXT_COLORS.DEFAULT,
        ...TYPOGRAPHY.CAPTION_2,
        fontSize: scale(10.5),
    },
    subSingerText: {
        color: TEXT_COLORS.DEFAULT,
        fontSize: scale(10.5),
    },
});
