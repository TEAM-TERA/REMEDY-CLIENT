import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RightArrowSvg = () => {
    return (
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.25775 13.7699L9.72828 8.01447L4.23353 2.23353C3.91939 1.90304 3.91944 1.37737 4.25029 1.02994C4.56624 0.716725 5.07099 0.724388 5.37769 1.04705L10.867 6.81645L12 8.01428L10.8615 9.20671C7.21418 13.0437 5.38771 14.965 5.38208 14.9706C5.06696 15.283 4.56357 15.2753 4.25772 14.9535C3.9444 14.6238 3.94442 14.0995 4.25775 13.7699Z"
                fill="white"
            />
        </Svg>
    );
};

export default RightArrowSvg;
