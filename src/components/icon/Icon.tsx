import React from 'react';
import EditSvg from './icons/EditSvg';
import LeftArrowSvg from './icons/LeftArrowSvg';
import LocationSvg from './icons/LocationSvg';
import SettingSvg from './icons/SettingSvg';
import CalendarSvg from './icons/CalendarSvg';
import HeartSvg from './icons/HeartSvg';
import RightArrowSvg from './icons/RightArrowSvg';
import ChatSvg from './icons/ChatSvg';
import LikeSvg from './icons/LikeSvg';
import CoinSvg from './icons/CoinSvg';
import TargetSvg from './icons/TargetSvg';
import PaintSvg from './icons/PaintSvg';
import RunningSvg from './icons/RunningSvg';
import MusicSvg from './icons/MusicSvg';

const icons = {
    edit: EditSvg,
    left: LeftArrowSvg,
    location: LocationSvg,
    setting: SettingSvg,
    calendar: CalendarSvg,
    heart: HeartSvg,
    right: RightArrowSvg,
    chat: ChatSvg,
    like: LikeSvg,
    coin: CoinSvg,
    target: TargetSvg,
    paint: PaintSvg,
    running: RunningSvg,
    music: MusicSvg,
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
