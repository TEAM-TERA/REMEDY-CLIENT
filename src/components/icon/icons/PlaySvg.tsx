import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PlaySvgProps {
  width?: number;
  height?: number;
  fill?: string;
}

const PlaySvg: React.FC<PlaySvgProps> = ({ 
  width = 16, 
  height = 18, 
  fill = 'white' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 18" fill="none">
      <Path d="M15.5 9L0.5 17.5L0.500001 0.5L15.5 9Z" fill={fill} />
    </Svg>
  );
};

export default PlaySvg;
