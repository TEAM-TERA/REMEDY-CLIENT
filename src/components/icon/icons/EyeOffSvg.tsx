import React from 'react';
import { Svg, Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

const EyeOffSvg = (props: SvgProps) => {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Path
        d="M1 1L19 19M8.5 8.67725C8.1888 9.02975 8 9.49295 8 10.0001C8 11.1046 8.8954 12.0001 10 12.0001C10.5072 12.0001 10.9703 11.8113 11.3229 11.5001M5.36185 5.56104C3.68002 6.73962 2.27894 8.41874 1 9.99994C2.88856 12.9909 6.2817 15.9999 10 15.9999C11.5499 15.9999 13.0434 15.4771 14.3949 14.6507M10 4C14.0084 4 16.7015 7.1582 19 10C18.6815 10.5043 18.3203 11.0092 17.922 11.5"
        stroke="#47476B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EyeOffSvg;
