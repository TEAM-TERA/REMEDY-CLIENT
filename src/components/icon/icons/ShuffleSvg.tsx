import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const ShuffleSvg: React.FC<Props> = ({
  width = 24,
  height = 24,
  color = '#E9E2E3',
  fill = 'none'
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <Path
      d="M17 5.3335L19.5 7.8335M19.5 7.8335L17 10.3335M19.5 7.8335H15.3333C14.2283 7.8335 13.1685 8.27248 12.3871 9.05388C11.6057 9.83529 11.1667 10.8951 11.1667 12.0002M17 18.6668L19.5 16.1668M19.5 16.1668L17 13.6668M19.5 16.1668H15.3333C14.2283 16.1668 13.1685 15.7278 12.3871 14.9464C11.6057 14.165 11.1667 13.1052 11.1667 12.0002M4.5 7.8335H7C8.10507 7.8335 9.16488 8.27248 9.94628 9.05388C10.7277 9.83529 11.1667 10.8951 11.1667 12.0002M11.1667 12.0002C11.1667 13.1052 10.7277 14.165 9.94628 14.9464C9.16488 15.7278 8.10507 16.1668 7 16.1668H4.5"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShuffleSvg;