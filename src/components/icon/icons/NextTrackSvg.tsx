import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const NextTrackSvg = (props: SvgProps) => {
  const fill = (props.fill as string) || props.color || '#E9E2E3';
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none" {...props}>
      <Path d="M25.9123 4.5V15.9975L6.75 4.5V31.5L25.9123 20.0025V31.5H29.25V4.5H25.9123Z" fill={fill} />
    </Svg>
  );
};

export default NextTrackSvg;
