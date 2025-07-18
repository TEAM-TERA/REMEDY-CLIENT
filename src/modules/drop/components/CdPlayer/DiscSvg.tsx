import React, { useEffect, useRef, useState } from "react";
import Svg, { Defs, Filter, FeFlood, FeColorMatrix, FeMorphology, FeOffset, FeGaussianBlur, FeComposite, FeBlend, G, Circle, ClipPath, Image as SvgImage } from "react-native-svg";

function DiscSvg({ imageUrl }: { imageUrl?: string }) {
  const [tilt, setTilt] = useState(0);
  // const reqRef = useRef<number | null>(null);

  // useEffect(() => {
  //   let last = Date.now();

  //   const animate = () => {
  //     const now = Date.now();
  //     const delta = now - last;
  //     last = now;
  //     setTilt(prev => prev + delta * 0.001);
  //     reqRef.current = requestAnimationFrame(animate);
  //   };

  //   reqRef.current = requestAnimationFrame(animate);
  //   return () => {
  //     if (reqRef.current) cancelAnimationFrame(reqRef.current);
  //   };
  // }, []);

  return (
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
        <ClipPath id="cd_clip">
          <Circle cx={204} cy={210} r={198} />
        </ClipPath>
      </Defs>
      <G filter="url(#filter0_d)">
        {imageUrl && (
          <SvgImage
            x={6}
            y={12}
            width={396}
            height={396}
            href={{ uri: imageUrl }}
            clipPath="url(#cd_clip)"
            preserveAspectRatio="xMidYMid slice"
            transform={`rotate(${tilt}, 204, 210)`}
          />
        )}
        <Circle cx={204} cy={210} r={60} fill="#130309" fillOpacity={0.5} />
        <Circle cx={204} cy={210} r={40} fill="#130309" />
      </G>
    </Svg>
  );
}

export default DiscSvg;