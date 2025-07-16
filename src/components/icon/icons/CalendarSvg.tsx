import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const CalendarSvg = (props: SvgProps) => {
    const fillColor = props.color || "#434356";
    
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.5 4.5C3.67157 4.5 3 5.17157 3 6V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V6C21 5.17157 20.3284 4.5 19.5 4.5H4.5ZM1.5 6C1.5 4.34315 2.84315 3 4.5 3H19.5C21.1569 3 22.5 4.34315 22.5 6V19.5C22.5 21.1569 21.1569 22.5 19.5 22.5H4.5C2.84315 22.5 1.5 21.1569 1.5 19.5V6Z"
                fill={fillColor}
            />
            {[
                [13.875, 10.875],
                [17.625, 10.875],
                [13.875, 14.625],
                [17.625, 14.625],
                [6.375, 14.625],
                [10.125, 14.625],
                [6.375, 18.375],
                [10.125, 18.375],
                [13.875, 18.375],
            ].map(([cx, cy], i) => (
                <Path
                    key={i}
                    d={`M${cx} ${cy + 1.125}C${cx + 0.6213} ${cy + 1.125} ${
                        cx + 1.125
                    } ${cy + 0.6213} ${cx + 1.125} ${cy}C${cx + 1.125} ${
                        cy - 0.6213
                    } ${cx + 0.6213} ${cy - 1.125} ${cx} ${cy - 1.125}C${
                        cx - 0.6213
                    } ${cy - 1.125} ${cx - 1.125} ${cy - 0.6213} ${
                        cx - 1.125
                    } ${cy}C${cx - 1.125} ${cy + 0.6213} ${cx - 0.6213} ${
                        cy + 1.125
                    } ${cx} ${cy + 1.125}Z`}
                    fill={fillColor}
                />
            ))}
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 1.5C6.41421 1.5 6.75 1.83579 6.75 2.25V3.75C6.75 4.16421 6.41421 4.5 6 4.5C5.58579 4.5 5.25 4.16421 5.25 3.75V2.25C5.25 1.83579 5.58579 1.5 6 1.5Z"
                fill={fillColor}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 1.5C18.4142 1.5 18.75 1.83579 18.75 2.25V3.75C18.75 4.16421 18.4142 4.5 18 4.5C17.5858 4.5 17.25 4.16421 17.25 3.75V2.25C17.25 1.83579 17.5858 1.5 18 1.5Z"
                fill={fillColor}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.25 6.75H21.75V8.25H2.25V6.75Z"
                fill={fillColor}
            />
        </Svg>
    );
};

export default CalendarSvg;
