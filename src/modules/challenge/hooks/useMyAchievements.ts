import { useQuery } from '@tanstack/react-query';
import { getActiveAchievements } from '../api/challengeApi';
import { achievementKeys } from '../queries/achievementKeys';

export function useMyAchievements() {
    return useQuery({
        queryKey: achievementKeys.my(),
        queryFn: () => getActiveAchievements(),
        select: (res) => res.achievements,
    });
}