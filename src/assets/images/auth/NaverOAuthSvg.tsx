import React from 'react';
import Svg, {
  Path,
  G,
  Defs,
  ClipPath,
  Rect,
  SvgProps,
  Circle,
} from 'react-native-svg';

function NaverOAuthSvg(props: SvgProps) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <Circle cx="24" cy="24" r="24" fill="#04CF5C" />
      <G clipPath="url(#clip0_521_1001)" transform="translate(6.4, 6.4)">
        <Path
          d="M20.7218 8.59961V17.6819L14.5028 8.59961H7.77686V26.6001H14.4808V17.5178L20.6998 26.6001H27.4233V8.59961H20.7218Z"
          fill="white"
        />
      </G>

      <Defs>
        <ClipPath id="clip0_521_1001">
          <Rect width="35.2" height="35.2" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default NaverOAuthSvg
