import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const PlayerSvg = (props: SvgProps) => {
  const strokeColor = props.color || '#D6D6DC';

  return (
    <Svg
      width={16}
      height={18}
      viewBox="0 0 16 18"
      fill="none"
      {...props}
    >
      <Path
        d="M8 9C10.2091 9 12 7.2091 12 5C12 2.79086 10.2091 1 8 1C5.79086 1 4 2.79086 4 5C4 7.2091 5.79086 9 8 9ZM8 9C4.13401 9 1 12.134 1 16V17M8 9C11.866 9 15 12.134 15 16V17"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PlayerSvg;
