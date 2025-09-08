import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ChatSvg = (props: SvgProps) => {
  const strokeColor = props.color || "white";

  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <Path
        d="M2.59985 1.51465H13.3997C13.6781 1.51465 13.9459 1.62535 14.1428 1.82227C14.3396 2.01912 14.4504 2.28614 14.4504 2.56445V9.76465C14.4504 10.043 14.3396 10.3099 14.1428 10.5068C13.9459 10.7037 13.6781 10.8145 13.3997 10.8145H4.77271C4.33514 10.8145 3.91507 10.9884 3.60571 11.2979L1.55005 13.3535V2.56445C1.5501 2.28605 1.6608 2.01913 1.85767 1.82227C2.02999 1.64994 2.25593 1.54338 2.49634 1.51953L2.59985 1.51465Z"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
    </Svg>
  );
};

export default ChatSvg;
