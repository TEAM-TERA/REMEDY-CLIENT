import { useQuery } from '@tanstack/react-query';
import { getActiveAchievements as fetchActiveAchievements } from '../api/challengeApi';
import { achievementKeys } from '../queries/achievementKeys';

export function useActiveAchievements() {
    return useQuery({
        queryKey: achievementKeys.active(),
        queryFn: fetchActiveAchievements,
        select: (res) => res.achievements,
    });
}