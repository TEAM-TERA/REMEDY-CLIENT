import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const DebateSvg = (props: SvgProps) => {
  const strokeColor = props.color || "#6210EF";

  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M7 9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9C17 11.7614 14.7614 14 12 14C10.8678 14 9.8237 13.6229 8.97998 13L7 14L8 12.0205C7.36964 11.1802 7 10.1346 7 9Z"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5 19.5C19.9853 19.5 22 17.4853 22 15C22 12.5147 19.9853 10.5 17.5 10.5C15.0147 10.5 13 12.5147 13 15C13 16.2137 13.4726 17.3142 14.25 18.125L13 20L15.875 19.25C16.4356 19.6524 17.1194 19.9524 17.5 19.5Z"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default DebateSvg;