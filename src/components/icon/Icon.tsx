import React from 'react';
import { SvgProps } from 'react-native-svg';
import EditSvg from './icons/EditSvg';
import LeftArrowSvg from './icons/LeftArrowSvg';
import LocationSvg from './icons/LocationSvg';
import SettingSvg from './icons/SettingSvg';
import CalendarSvg from './icons/CalendarSvg';
import HeartSvg from './icons/HeartSvg';
import RightArrowSvg from './icons/RightArrowSvg';

const icons = {
    edit: EditSvg,
    left: LeftArrowSvg,
    location: LocationSvg,
    setting: SettingSvg,
    calendar: CalendarSvg,
    heart: HeartSvg,
    right: RightArrowSvg,
};

type IconName = keyof typeof icons;

interface Props {
    name: IconName;
    width?: number;
    height?: number;
    color?: string;
}

const Icon: React.FC<Props> = ({ name, ...props }) => {
    const SvgIcon = icons[name];
    return <SvgIcon {...props} />;
};

export default Icon;
