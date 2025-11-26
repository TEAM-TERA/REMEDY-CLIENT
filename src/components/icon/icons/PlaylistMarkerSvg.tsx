import React from 'react';
import Svg, { G, Rect, Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';

interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const PlaylistMarkerSvg = (props: SvgProps) => {
  return (
    <Svg width={props.width || 75} height={props.height || 75} viewBox="0 0 75 75" fill="none" {...props}>
      <Defs>
        <Filter
          id="filter0_d_1_4961"
          x="0"
          y="0"
          width="75"
          height="75"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset/>
          <FeGaussianBlur stdDeviation="10"/>
          <FeComposite in2="hardAlpha" operator="out"/>
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.580392 0 0 0 0 0.160784 0 0 0 1 0"
          />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_4961"/>
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_4961" result="shape"/>
        </Filter>
      </Defs>
      <G filter="url(#filter0_d_1_4961)">
        <Rect
          x="20"
          y="20"
          width="35"
          height="35"
          rx="17.5"
          fill="#101118"
          shapeRendering="crispEdges"
        />
        <Path
          d="M47.5049 35.1279C48.1335 34.9773 48.7381 35.4532 48.7383 36.0996V36.9521C48.7381 37.4143 48.4202 37.816 47.9707 37.9238L45.8613 38.4307V44.3203C45.8612 45.1155 45.0555 45.7598 44.0615 45.7598C43.0676 45.7597 42.2619 45.1154 42.2617 44.3203C42.2617 43.5251 43.0675 42.88 44.0615 42.8799C44.2719 42.8799 44.4744 42.9088 44.6621 42.9619V36.4004C44.6621 36.0572 44.8641 35.7616 45.1445 35.6943L47.5049 35.1279ZM38.2617 41.2402C38.814 41.2402 39.2617 41.6879 39.2617 42.2402C39.2617 42.7925 38.814 43.2402 38.2617 43.2402H27.2617C26.7094 43.2402 26.2617 42.7925 26.2617 42.2402C26.2617 41.6879 26.7094 41.2402 27.2617 41.2402H38.2617ZM41.2617 35.2402C41.814 35.2402 42.2617 35.6879 42.2617 36.2402C42.2617 36.7925 41.814 37.2402 41.2617 37.2402H27.2617C26.7094 37.2402 26.2617 36.7925 26.2617 36.2402C26.2617 35.6879 26.7094 35.2402 27.2617 35.2402H41.2617ZM45.2617 29.2402C45.814 29.2402 46.2617 29.6879 46.2617 30.2402C46.2617 30.7925 45.814 31.2402 45.2617 31.2402H27.2617C26.7094 31.2402 26.2617 30.7925 26.2617 30.2402C26.2617 29.6879 26.7094 29.2402 27.2617 29.2402H45.2617Z"
          fill="#EF9210"
        />
      </G>
    </Svg>
  );
};

export default PlaylistMarkerSvg;