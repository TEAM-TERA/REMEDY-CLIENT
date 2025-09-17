import React from 'react';

import { TEXT_COLORS } from '../../../constants/colors';
import Svg, { G, Defs, ClipPath, Path } from 'react-native-svg';

const TargetSvg = ({ width = 24, height = 24, color = TEXT_COLORS.DEFAULT }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0_3498_1250)">
                <Path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.2761 11 12.5261 11.1119 12.7071 11.2929C12.8881 11.4739 13 11.7239 13 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M18.6129 4.3731L17.0733 6.18938M18.6129 4.3731L19.9915 4.29319L18.452 6.10946L17.0733 6.18938M18.6129 4.3731L18.4658 3L16.9263 4.81627L17.0733 6.18938M12.7627 11.2749L17.0733 6.18938" stroke={color} strokeWidth="2"/>
            </G>
            <Defs>
                <ClipPath id="clip0_3498_1250">
                    <Path fill="white"/>
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default TargetSvg;
