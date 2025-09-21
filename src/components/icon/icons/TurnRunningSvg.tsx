import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { PRIMARY_COLORS } from '../../../constants/colors';

const TurnRunningSvg = ({ width = 24, height = 24, color = PRIMARY_COLORS.DEFAULT }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_3672_1535)">
        <Path 
          d="M10.9 4.29998C10.2925 4.29998 9.8 3.80749 9.8 3.19998C9.8 2.59246 10.2925 2.09998 10.9 2.09998C11.5075 2.09998 12 2.59246 12 3.19998C12 3.80749 11.5075 4.29998 10.9 4.29998Z" 
          stroke={color} 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M20.7998 17.5L15.2998 18.6L14.4748 16.95" 
          stroke={color} 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M8.7001 21.9V17.5L13.1001 14.2L12.0001 7.59998" 
          stroke={color} 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M17.5 12V8.69998L12 7.59998L8.7 10.9L5.4 12" 
          stroke={color} 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3672_1535">
          <Rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default TurnRunningSvg;
