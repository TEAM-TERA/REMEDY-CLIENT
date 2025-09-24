import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { PRIMARY_COLORS } from '../../../constants/colors';

const ClockSvg = ({ width = 24, height = 24, color = PRIMARY_COLORS.DEFAULT }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_5573_1610)">
        <Path 
          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M12 7V12L15 15" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_5573_1610">
          <Rect width="24" height="24" fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ClockSvg;