import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { TEXT_COLORS } from '../../../constants/colors';

const PaintSvg = ({ width = 24, height = 24, color = TEXT_COLORS.DEFAULT }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path d="M2.1001 12.0001C2.1001 17.4677 6.53248 21.9001 12.0001 21.9001C16.6389 21.9001 15.9601 18.9301 15.9601 16.4551C15.9601 13.9801 21.9001 18.9301 21.9001 12.0001C21.9001 6.53248 17.4677 2.1001 12.0001 2.1001C6.53248 2.1001 2.1001 6.53248 2.1001 12.0001Z" stroke={color} strokeWidth="2"/>
            <Circle cx="12" cy="7" r="2" fill={color}/>
            <Circle cx="7" cy="10" r="2" fill={color}/>
            <Circle cx="9" cy="16" r="2" fill={color}/>
            <Circle cx="17" cy="10" r="2" fill={color}/>
        </Svg>
    );
};

export default PaintSvg;
