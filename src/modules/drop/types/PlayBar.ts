export type PlayBarProps = {
    currentTime : number;
    musicTime : number;
    onSeek? : (position : number)=>void;
};