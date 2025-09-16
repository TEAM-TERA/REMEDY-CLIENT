import React from 'react';
import Svg, { Path, Defs, ClipPath, Rect, SvgProps, G } from 'react-native-svg';

const TargetSvg = (props: SvgProps) => {
    return (
        <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
            <G clipPath="url(#clip0)">
                <Path
                    d="M17.5 12C17.5 14.7614 15.2614 17 12.5 17C9.73858 17 7.5 14.7614 7.5 12C7.5 9.23858 9.73858 7 12.5 7M21.5 12C21.5 16.9706 17.4706 21 12.5 21C7.52944 21 3.5 16.9706 3.5 12C3.5 7.02944 7.52944 3 12.5 3M13.5 12C13.5 12.5523 13.0523 13 12.5 13C11.9477 13 11.5 12.5523 11.5 12C11.5 11.4477 11.9477 11 12.5 11C12.7761 11 13.0261 11.1119 13.2071 11.2929C13.3881 11.4739 13.5 11.7239 13.5 12Z"
                    stroke={props.color || '#D6D6DC'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M19.1129 4.3731L17.5733 6.18938M19.1129 4.3731L20.4915 4.29319L18.952 6.10946L17.5733 6.18938M19.1129 4.3731L18.9658 3L17.4263 4.81627L17.5733 6.18938M13.2627 11.2749L17.5733 6.18938"
                    stroke={props.color || '#D6D6DC'}
                    strokeWidth={2}
                />
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect
                        width={24}
                        height={24}
                        fill="white"
                        transform="translate(0.5)"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default TargetSvg;
