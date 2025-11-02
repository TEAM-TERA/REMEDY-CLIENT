import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/profileApi';
import { profileKeys } from '../../../queries/keys/profile';
import { useContext } from 'react';
import { AuthContext } from '../../auth/auth-context';
import type { Profile } from '../types/profile';

export function useMyProfile() {
    const { userToken } = useContext(AuthContext);

    return useQuery<Profile>({
        queryKey: profileKeys.me(),
        queryFn: getMyProfile,
        enabled: !!userToken,
    });
}