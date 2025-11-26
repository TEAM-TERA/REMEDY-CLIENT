import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const DeleteSvg: React.FC<Props> = ({
  width = 24,
  height = 24,
  color = '#EF9210',
  fill = 'none'
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <Path
      d="M6 8.25H18M10.5 11.25V15.75M13.5 11.25V15.75M6.75 8.25L7.5 17.25C7.5 17.6478 7.65804 18.0294 7.93934 18.3107C8.22064 18.592 8.60218 18.75 9 18.75H15C15.3978 18.75 15.7794 18.592 16.0607 18.3107C16.342 18.0294 16.5 17.6478 16.5 17.25L17.25 8.25M9.75 8.25V6C9.75 5.80109 9.82902 5.61032 9.96967 5.46967C10.1103 5.32902 10.3011 5.25 10.5 5.25H13.5C13.6989 5.25 13.8897 5.32902 14.0303 5.46967C14.171 5.61032 14.25 5.80109 14.25 6V8.25"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DeleteSvg;