import React from 'react';
import Svg, { G, Circle, Path, Defs, ClipPath } from 'react-native-svg';
import { TEXT_COLORS, PRIMARY_COLORS } from '../../../constants/colors';

const MusicSvg = ({ width = 24, height = 24, color = PRIMARY_COLORS.DEFAULT }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0_3498_1236)">
                <Circle cx="12" cy="12" r="11" stroke={color} strokeWidth="2"/>
                <Path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM15.7939 7.1416C15.6637 7.02299 15.4923 6.97503 15.3271 7.01172L9.70215 8.26172C9.43922 8.32015 9.25 8.57708 9.25 8.875V14.5713C9.07406 14.5252 8.88473 14.5 8.6875 14.5C7.75552 14.5 7 15.0596 7 15.75C7 16.4404 7.75552 17 8.6875 17C9.61948 17 10.375 16.4404 10.375 15.75V10.6377L14.875 9.6377V13.3213C14.6991 13.2752 14.5097 13.25 14.3125 13.25C13.3805 13.25 12.625 13.8096 12.625 14.5C12.625 15.1904 13.3805 15.75 14.3125 15.75C15.2445 15.75 16 15.1904 16 14.5V7.625C16 7.43776 15.9243 7.26031 15.7939 7.1416Z" fill={color}/>
            </G>
            <Defs>
                <ClipPath id="clip0_3498_1236">
                    <Path fill="white"/>
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default MusicSvg;
