import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function EyeOnSvg(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      fill="none"
      {...props}
    >
      <Path
        d="M10 9C11.1046 9 12 8.1046 12 7C12 5.8954 11.1046 5 10 5C8.8954 5 8 5.8954 8 7C8 8.1046 8.8954 9 10 9Z"
        stroke="#47476B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 7C17.1114 9.991 13.7183 13 10 13C6.2817 13 2.88856 9.991 1 7C3.29855 4.15825 5.99163 1 10 1C14.0084 1 16.7015 4.1582 19 7Z"
        stroke="#47476B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default EyeOnSvg;
