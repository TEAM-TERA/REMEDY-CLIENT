import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ListSvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const ListSvg: React.FC<ListSvgProps> = ({
  width = 24,
  height = 24,
  color = '#FFFFFF'
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M3 12h18M3 18h18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default ListSvg;