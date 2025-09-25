import React from 'react';
import { TouchableOpacity } from 'react-native';
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
import TurnRunningSvg from './icons/TurnRunningSvg';
import ClockSvg from './icons/ClockSvg';
import PauseSvg from './icons/PauseSvg';
import PlaySvg from './icons/PlaySvg';

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
    turnRunning: TurnRunningSvg,
    clock: ClockSvg,
    pause: PauseSvg,
    play: PlaySvg,
};

type IconName = keyof typeof icons;

interface Props {
    name: IconName;
    pressname?: IconName;
    width?: number;
    height?: number;
    color?: string;
    fill?: string;
    isPress?: boolean;
    onPress?: () => void;
}

const Icon: React.FC<Props> = ({ name, onPress, pressname = name, isPress = false, ...props }) => {
    const SvgIcon = icons[name];
    if (onPress) {
        if (isPress){
            const SvgIconPress = icons[pressname];
            return (
                <TouchableOpacity onPress={onPress}>
                    <SvgIconPress {...props} />
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity onPress={onPress}>
                <SvgIcon {...props} />
            </TouchableOpacity>
        );
    }
    return <SvgIcon {...props} />;
};

export default Icon;
