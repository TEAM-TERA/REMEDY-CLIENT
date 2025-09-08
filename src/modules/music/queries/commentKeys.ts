export const commentKeys = {
    all: ['comments'] as const,
    byDrop: (droppingId: string) => [...commentKeys.all, 'byDrop', droppingId] as const,
    item: (commentId: number) => [...commentKeys.all, 'item', commentId] as const,
};