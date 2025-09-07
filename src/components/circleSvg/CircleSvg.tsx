import Svg, { Circle } from 'react-native-svg';
import { scale } from '../../utils/scalers';
import { BACKGROUND_COLORS } from '../../constants/colors';

function CircleSvg() {
    return (
        <Svg
            width={scale(81)}
            height={scale(61)}
            viewBox="0 0 81 61"
            fill="none"
        >
            <Circle
                cx={scale(40.1934)}
                cy={scale(40)}
                r={scale(40)}
                fill={BACKGROUND_COLORS.BACKGROUND_RED}
            />
        </Svg>
    );
}

export default CircleSvg;
