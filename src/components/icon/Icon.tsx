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
import CustomBoxSvg from './icons/CustomBoxSvg';
import NameTagSvg from './icons/NameTagSvg';
import PlayerSvg from './icons/PlayerSVG';
import ToggleOffSvg from './icons/ToggleOffSvg';
import ToggleOnSvg from './icons/ToggleOnSvg';
import UserSvg from './icons/UserSvg';
import DangerSvg from './icons/DangerSvg';
import EyeOnSvg from './icons/EyeOnSvg';
import EyeOffSvg from './icons/EyeOffSvg';
import ListSvg from './icons/ListSvg';
import PrevTrackSvg from './icons/PrevTrackSvg';
import NextTrackSvg from './icons/NextTrackSvg';
import DownloadSvg from './icons/DownloadSvg';
import PlaylistSvg from './icons/PlaylistSvg';
import DebateSvg from './icons/DebateSvg';
import PlusSvg from './icons/PlusSvg';
import TrashSvg from './icons/TrashSvg';

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
    customBox: CustomBoxSvg,
    nameTag: NameTagSvg,
    player: PlayerSvg,
    toggleOff: ToggleOffSvg,
    toggleOn: ToggleOnSvg, 
    user: UserSvg,
    danger: DangerSvg,
    eyeOn: EyeOnSvg,
    eyeOff: EyeOffSvg,
    list: ListSvg,
    prevTrack: PrevTrackSvg,
    nextTrack: NextTrackSvg,
    download: DownloadSvg,
    playlist: PlaylistSvg,
    debate: DebateSvg,
    plus: PlusSvg,
    trash: TrashSvg,
};

export type IconName = keyof typeof icons;

interface Props {
    name: IconName;
    pressname?: IconName;
    width?: number;
    height?: number;
    color?: string;
    fill?: string;
    isPress?: boolean;
    onPress?: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

const Icon: React.FC<Props> = ({
    name,
    onPress,
    pressname = name,
    isPress = false,
    accessibilityLabel,
    accessibilityHint,
    ...props
}) => {
    const SvgIcon = icons[name];
    if (onPress) {
        if (isPress) {
            const SvgIconPress = icons[pressname];
            return (
                <TouchableOpacity 
                    onPress={onPress}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityHint={accessibilityHint}
                    accessibilityRole="button"
                >
                    <SvgIconPress {...props} />
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity 
                onPress={onPress}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole="button"
            >
                <SvgIcon {...props} />
            </TouchableOpacity>
        );
    }
    return <SvgIcon {...props} />;
};

export default Icon;
