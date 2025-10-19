import { useQuery } from '@tanstack/react-query';
import { getMyAchievements } from '../api/challengeApi';
import { achievementKeys } from '../queries/achievementKeys';

export function useMyAchievements() {
    return useQuery({
        queryKey: achievementKeys.my(),
        queryFn: getMyAchievements,
    });
}
