import React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import { TEXT_COLORS } from '../../../constants/colors';

const RunningSvg = ({ width = 24, height = 24, color = TEXT_COLORS.CAPTION }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0_3672_1528)">
                <Path d="M10.9 4.3001C10.2925 4.3001 9.8 3.80761 9.8 3.2001C9.8 2.59258 10.2925 2.1001 10.9 2.1001C11.5075 2.1001 12 2.59258 12 3.2001C12 3.80761 11.5075 4.3001 10.9 4.3001Z" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M20.7998 17.5002L15.2998 18.6002L14.4748 16.9502" stroke={color} strokeWidth="2.2" strokeLinecap="round" stroke-linejoin="round"/>
                <Path d="M8.7001 21.9001V17.5001L13.1001 14.2001L12.0001 7.6001" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M17.5 12.0001V8.7001L12 7.6001L8.7 10.9001L5.4 12.0001" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </G>
            <Defs>
                <ClipPath id="clip0_3672_1528">
                    <Path fill="white" transform="matrix(-1 0 0 1 24 0)"/>
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default RunningSvg;
