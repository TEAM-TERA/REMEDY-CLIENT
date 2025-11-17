import React from 'react';

import { TEXT_COLORS } from '../../../constants/colors';
import Svg, { Path } from 'react-native-svg';

const ArrowDownSvg = ({ width = 24, height = 24, color = TEXT_COLORS.DEFAULT }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 7L12 17L21 7"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </Svg>
    );
};

export default ArrowDownSvg;
