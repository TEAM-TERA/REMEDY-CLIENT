import React from 'react';
import Svg, { G, Rect, Defs, ClipPath } from 'react-native-svg';

interface PauseSvgProps {
  width?: number;
  height?: number;
  fill?: string;
}

const PauseSvg: React.FC<PauseSvgProps> = ({ 
  width = 20, 
  height = 20, 
  fill = 'white' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <G clipPath="url(#clip0_1765_2350)">
        <Rect x="4" y="1.5" width="4" height="17" fill={fill} />
        <Rect x="12" y="1.5" width="4" height="17" fill={fill} />
      </G>
      <Defs>
        <ClipPath id="clip0_1765_2350">
          <Rect width="20" height="20" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default PauseSvg;
