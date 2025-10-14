import { ChallengeData } from '../types/ChallengeProps';

export const dailyChallengeData: ChallengeData[] = [
    {
        id: 1,
        title: '첫 드롭핑 만들기',
        description: '오늘 처음으로 음악 드롭핑을 생성하세요',
        coin: 10,
        progress: 0,
    },
    {
        id: 2,
        title: '음악 감상하기',
        description: '다른 사용자의 드롭핑 음악을 3곡 이상 들어보세요',
        coin: 5,
        progress: 40,
    },
    {
        id: 3,
        title: '댓글 달기',
        description: '마음에 드는 음악에 댓글을 남겨보세요',
        coin: 8,
        progress: 0,
    },
    {
        id: 4,
        title: '좋아요 누르기',
        description: '5개의 드롭핑에 좋아요를 눌러보세요',
        coin: 6,
        progress: 60,
    },
    {
        id: 5,
        title: '러닝 시작하기',
        description: '러닝 모드를 활성화하고 5분간 운동해보세요',
        coin: 12,
        progress: 20,
    },
    {
        id: 6,
        title: '새로운 장소 탐험',
        description: '처음 가는 위치에서 드롭핑을 발견해보세요',
        coin: 15,
        progress: 0,
    },
];

export const alwaysChallengeData: ChallengeData[] = [
    {
        id: 7,
        title: '드롭핑 마스터',
        description: '총 50개의 드롭핑을 생성하세요',
        coin: 100,
        progress: 30,
    },
    {
        id: 8,
        title: '음악 큐레이터',
        description: '10개 이상의 서로 다른 장르 음악을 드롭핑하세요',
        coin: 80,
        progress: 50,
    },
    {
        id: 9,
        title: '소셜 활동가',
        description: '다른 사용자와 총 100개의 상호작용(댓글/좋아요)을 완료하세요',
        coin: 120,
        progress: 25,
    },
    {
        id: 10,
        title: '운동 애호가',
        description: '누적 러닝 시간 10시간을 달성하세요',
        coin: 150,
        progress: 15,
    },
];
