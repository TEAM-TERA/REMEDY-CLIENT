import React from 'react';
import Svg, {
    Circle,
    Path,
    Defs,
    ClipPath,
    Rect,
    SvgProps,
    G,
} from 'react-native-svg';

const CoinSvg = (props: SvgProps) => {
    return (
        <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
            <G clipPath="url(#clip0)">
                <Circle
                    cx={12.5}
                    cy={12}
                    r={11}
                    stroke={props.color || '#DF2053'}
                    strokeWidth={2}
                />
                <Path
                    d="M12.5 3C17.4706 3 21.5 7.02944 21.5 12C21.5 16.9706 17.4706 21 12.5 21C7.52944 21 3.5 16.9706 3.5 12C3.5 7.02944 7.52944 3 12.5 3ZM16.2939 7.1416C16.1637 7.02299 15.9923 6.97503 15.8271 7.01172L10.2021 8.26172C9.93922 8.32015 9.75 8.57708 9.75 8.875V14.5713C9.57406 14.5252 9.38473 14.5 9.1875 14.5C8.25552 14.5 7.5 15.0596 7.5 15.75C7.5 16.4404 8.25552 17 9.1875 17C10.1195 17 10.875 16.4404 10.875 15.75V10.6377L15.375 9.6377V13.3213C15.1991 13.2752 15.0097 13.25 14.8125 13.25C13.8805 13.25 13.125 13.8096 13.125 14.5C13.125 15.1904 13.8805 15.75 14.8125 15.75C15.7445 15.75 16.5 15.1904 16.5 14.5V7.625C16.5 7.43776 16.4243 7.26031 16.2939 7.1416Z"
                    fill={props.color || '#DF2053'}
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

export default CoinSvg;
