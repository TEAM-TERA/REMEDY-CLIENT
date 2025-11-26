import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const RepeatSvg = (props: SvgProps) => {
  const fill = (props.fill as string) || props.color || '#E9E2E3';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M15.75 3.75L18.75 6.75M18.75 6.75L15.75 9.75M18.75 6.75H8.25C7.45435 6.75 6.69129 7.06607 6.12868 7.62868C5.56607 8.19129 5.25 8.95435 5.25 9.75V11.25M8.25 20.25L5.25 17.25M5.25 17.25L8.25 14.25M5.25 17.25H15.75C16.5456 17.25 17.3087 16.9339 17.8713 16.3713C18.4339 15.8087 18.75 15.0456 18.75 14.25V12.75"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default RepeatSvg;