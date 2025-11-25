import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const TrashSvg = (props: SvgProps) => {
  const stroke = props.color || '#F3124E';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 7h16"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M10 11v6M14 11v6"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M6 7l1 12a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default TrashSvg;
