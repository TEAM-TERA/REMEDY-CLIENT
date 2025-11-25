import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const PlaylistSvg = (props: SvgProps) => {
  const fillColor = props.color || "#EF9210";

  return (
    <Svg
      width={24}
      height={20}
      viewBox="0 0 24 20"
      fill="none"
      {...props}
    >
      <Path
        d="M2 4H16M2 8H16M2 12H12M2 16H12M18 14V6L22 4V12L18 14Z"
        stroke={fillColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PlaylistSvg;