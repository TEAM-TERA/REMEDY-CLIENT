import { StyleSheet, Dimensions } from 'react-native';
import { scale } from '../../../../utils/scalers';
import { TEXT_COLORS, PRIMARY_COLORS } from '../../../../constants/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    slide: {
        width: width,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: scale(64),
        paddingHorizontal: scale(24),
        gap: scale(64),
    },
    image: {
        width: '100%',
        height: scale(400),
    },
    logoImage: {
        width: scale(270),
        height: scale(270),
    },
    lastImage: {
        position: 'absolute',
        bottom: scale(130),
        width: '150%',
        height: scale(800),
    },
    textContainer: {
        alignItems: 'center',
        gap: scale(8),
    },
    firstScreenTextWrapper: {
        alignSelf: 'stretch',
        paddingVertical: scale(12),
        paddingHorizontal: scale(12),
        gap: scale(24),
    },
    firstScreenInnerTextContainer: {
        alignItems: 'flex-start',
        gap: scale(8),
    },
    lastScreenTextWrapper: {
        alignSelf: 'stretch',
        gap: scale(24),
        alignItems: 'flex-start',
    },
    imageTextWrapper: {
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: scale(12),
        gap: scale(24),
    },
    textOnly: {
        alignItems: 'flex-start',
        gap: scale(8),
        alignSelf: 'stretch',
    },
    title: {
        color: TEXT_COLORS.DEFAULT,
        textAlign: 'center',
    },
    subtitle: {
        color: TEXT_COLORS.DEFAULT,
        textAlign: 'center',
    },
    description: {
        color: TEXT_COLORS.DEFAULT,
        textAlign: 'center',
    },
    highlight: {
        color: PRIMARY_COLORS.DEFAULT,
    },
    leftAlign: {
        textAlign: 'left',
    },
    button: {
        borderRadius: scale(8),
    },
    buttonWithMargin: {
        margin: scale(12),
        borderRadius: scale(8),
    },
});
