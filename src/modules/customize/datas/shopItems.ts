import { IconName } from '../../../components/icon/Icon';

export const titleItems = [
    {
        id: '1',
        name: '뮤즈',
        price: 12,
        color: '#E63B7A',
        type: 'title' as const,
    },
    {
        id: '2',
        name: '아폴론',
        price: 24,
        color: '#724EEB',
        type: 'title' as const,
    },
    {
        id: '3',
        name: '오로라',
        price: 24,
        color: '#FBB03B',
        type: 'title' as const,
    },
];

export const playerItems = [
    {
        id: '4',
        name: '플레이어(노랑)',
        price: 24,
        color: '#FFD93B',
        type: 'player' as const,
    },
    {
        id: '5',
        name: '플레이어(보라)',
        price: 24,
        color: '#9966FF',
        type: 'player' as const,
    },
];

export const mysteryItems = [
    {
        id: '6',
        name: '???',
        price: 24,
        color: '#444',
        type: 'mystery' as const,
    },
    {
        id: '7',
        name: '???',
        price: 24,
        color: '#666',
        type: 'mystery' as const,
    },
];

export const sections: Array<{ icon?: IconName; title: string; items: any[] }> =
    [
        { icon: 'nameTag', title: '칭호', items: titleItems },
        { icon: 'player', title: '플레이어', items: playerItems },
        { title: '??', items: mysteryItems },
    ];
