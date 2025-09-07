export const profileKeys = {
    all: ['profile'] as const,
    me: () => [...profileKeys.all, 'me'] as const,
    detail: (id: string | number) => [...profileKeys.all, 'detail', id] as const,
};