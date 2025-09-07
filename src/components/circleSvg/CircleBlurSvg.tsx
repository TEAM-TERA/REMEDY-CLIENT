import Svg, { Circle } from 'react-native-svg';
import { scale } from '../../utils/scalers';
import { BACKGROUND_COLORS } from '../../constants/colors';

function CircleBlurSvg() {
    return (
        <Svg
            width={scale(121)}
            height={scale(81)}
            viewBox="0 0 121 81"
            fill="none"
        >
            <Circle
                cx={scale(60.1934)}
                cy={scale(60)}
                r={scale(60)}
                fill={BACKGROUND_COLORS.BACKGROUND_RED}
                fillOpacity={0.5}
            />
        </Svg>
    );
}

export default CircleBlurSvg;
