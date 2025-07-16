import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const LocationSvg = (props: SvgProps) => {
    return (
        <Svg width={18} height={20} viewBox="0 0 18 20" fill="none" {...props}>
            <Path
                d="M9 11.7112C10.6569 11.7112 12 10.4033 12 8.78991C12 7.17651 10.6569 5.86859 9 5.86859C7.34315 5.86859 6 7.17651 6 8.78991C6 10.4033 7.34315 11.7112 9 11.7112Z"
                stroke={props.color || "white"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14.657 14.2985L10.414 18.4303C10.039 18.7951 9.53059 19 9.0005 19C8.47042 19 7.96202 18.7951 7.587 18.4303L3.343 14.2985C2.22422 13.2091 1.46234 11.821 1.15369 10.3098C0.845043 8.7987 1.00349 7.23237 1.60901 5.80892C2.21452 4.38547 3.2399 3.16884 4.55548 2.31286C5.87107 1.45688 7.41777 1 9 1C10.5822 1 12.1289 1.45688 13.4445 2.31286C14.7601 3.16884 15.7855 4.38547 16.391 5.80892C16.9965 7.23237 17.155 8.7987 16.8463 10.3098C16.5377 11.821 15.7758 13.2091 14.657 14.2985Z"
                stroke={props.color || "white"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default LocationSvg;
