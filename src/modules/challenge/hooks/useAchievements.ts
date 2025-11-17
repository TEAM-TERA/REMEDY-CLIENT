import { useQuery } from '@tanstack/react-query';
import { getActiveAchievements as fetchActiveAchievements } from '../api/challengeApi';
import { achievementKeys } from '../queries/achievementKeys';

type Params = { period?: 'DAILY' | 'PERMANENT'; page?: number; size?: number } | undefined;

export function useActiveAchievements(params?: Params) {
    const key = [...achievementKeys.active(), params?.period ?? null, params?.page ?? 0, params?.size ?? 10] as const;
    return useQuery({
        queryKey: key,
        queryFn: () => fetchActiveAchievements(params),
        select: (res) => res.achievements,
    });
}