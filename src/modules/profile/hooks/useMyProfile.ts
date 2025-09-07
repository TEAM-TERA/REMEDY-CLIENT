import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/profileApi';
import { profileKeys } from '../../../queries/keys/profile';

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
  });
}
