export type ChallengeData = {
    id: number;
    title: string;
    description: string;
    coin: number;
    progress: number;
};

export type ChallengeProps = {
    title: string;
    description: string;
    coin: number;
    progress: string;
    currentValue: number;
    targetValue: number;
    sideBarColor: string;
};
