// src/components/map/BlurredDisc.tsx
import React from "react";
import Svg, { Defs, Filter, FeFlood, FeColorMatrix, FeMorphology, FeOffset, FeGaussianBlur, FeComposite, FeBlend, Rect, G, Circle, ClipPath } from "react-native-svg";

function DiscSvg () {
    return(
        <Svg width={407} height={231} viewBox="0 0 407 231" fill="none">
            <Defs>
            <Filter id="filter0_d" x="0" y="0" width="406.613" height="406.613" filterUnits="userSpaceOnUse">
                <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow" />
                <FeOffset dy="4" />
                <FeGaussianBlur stdDeviation="2" />
                <FeComposite in2="hardAlpha" operator="out" />
                <FeColorMatrix type="matrix" values="0 0 0 0 0.94902 0 0 0 0 0.247059 0 0 0 0 0.435294 0 0 0 0.15 0" />
                <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </Filter>
            <ClipPath id="bgblur_clip">
                <Circle cx="204" cy="210" r="60" />
            </ClipPath>
            </Defs>
            <G filter="url(#filter0_d)">
            <Rect x="5" y="1" width="396.613" height="396.613" rx="198.307" fill="white" />
            <Circle cx="204" cy="210" r="60" fill="#130309" fillOpacity={0.5} />
            <Circle cx="204" cy="210" r="40" fill="#130309" />
            </G>
        </Svg>
    );
}
export default DiscSvg;