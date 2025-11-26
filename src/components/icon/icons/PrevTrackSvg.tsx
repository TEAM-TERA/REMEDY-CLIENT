import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const PrevTrackSvg = (props: SvgProps) => {
  const fill = (props.fill as string) || props.color || '#E9E2E3';
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none" {...props}>
      <Path d="M10.0877 4.5V15.9975L29.25 4.5V31.5L10.0877 20.0025V31.5H6.75V4.5H10.0877Z" fill={fill} />
    </Svg>
  );
};

export default PrevTrackSvg;
