import { IconName } from '../../../components/icon/Icon';

export const titleItems = [
    {
        id: '0',
        name: '모험가',
        price: 0,
        color: '#8E8E93',
        type: 'title' as const,
        isDefault: true,
    },
    {
        id: '1',
        name: '열렬한 탐험가',
        price: 0,
        color: '#FF9500',
        type: 'title' as const,
        isDefault: true,
    },
    {
        id: '2',
        name: '뮤즈',
        price: 12,
        color: '#E63B7A',
        type: 'title' as const,
    },
    {
        id: '3',
        name: '아폴론',
        price: 24,
        color: '#724EEB',
        type: 'title' as const,
    },
    {
        id: '4',
        name: '오로라',
        price: 24,
        color: '#FBB03B',
        type: 'title' as const,
    },
];

export const playerItems = [
    {
        id: '10',
        name: '기본',
        price: 0,
        color: '#F23F6F',
        type: 'player' as const,
        isDefault: true,
    },
    {
        id: '11',
        name: '플레이어(노랑)',
        price: 24,
        color: '#FFD93B',
        type: 'player' as const,
    },
    {
        id: '12',
        name: '플레이어(보라)',
        price: 24,
        color: '#9966FF',
        type: 'player' as const,
    },
];

export const mysteryItems = [
    {
        id: '20',
        name: '????',
        price: 24,
        color: '#444',
        type: 'mystery' as const,
    },
    {
        id: '21',
        name: '????',
        price: 24,
        color: '#555',
        type: 'mystery' as const,
    },
    {
        id: '22',
        name: '????',
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
