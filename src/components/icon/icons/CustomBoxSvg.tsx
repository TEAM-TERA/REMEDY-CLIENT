import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const BoxSvg = (props: SvgProps) => {
  const strokeColor = props.color || '#D6D6DC';

  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M3 10V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V10M3 10V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V10M3 10H8.5M21 10H15.5M15.5 10H12H8.5M15.5 10C15.5 10 15.5 14 12 14C8.5 14 8.5 10 8.5 10"
        stroke={strokeColor}
        strokeWidth={2}
      />
    </Svg>
  );
};

export default BoxSvg;
