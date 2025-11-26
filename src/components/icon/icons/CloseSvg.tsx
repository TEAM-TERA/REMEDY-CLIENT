import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const CloseSvg = (props: SvgProps) => {
  const stroke = (props.fill as string) || props.color || '#47476B';

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M18 6.0002L11.944 12.0562L18 18.1121M6 5.88794L12.056 11.9439L6 17.9998"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CloseSvg;