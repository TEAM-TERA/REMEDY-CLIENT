import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const PlusSvg = (props: SvgProps) => {
  const stroke = props.color || '#E9E2E3';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 5v14M5 12h14"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PlusSvg;
