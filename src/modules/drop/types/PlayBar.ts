export type PlayBarProps = {
    currentTime : number;
    musicTime : number;
    onSeek? : (position : number)=>void;
    onTogglePlay?: () => void;
    isPlaying?: boolean;
};