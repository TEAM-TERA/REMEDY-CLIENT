export const achievementKeys = {
    all: ['achievements'] as const,
    lists: () => [...achievementKeys.all, 'list'] as const,
    active: () => [...achievementKeys.all, 'active'] as const,
    my: () => [...achievementKeys.all, 'my'] as const,
    detail: (id: number) => [...achievementKeys.all, 'detail', id] as const,
};
