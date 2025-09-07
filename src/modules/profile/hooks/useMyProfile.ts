import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/profileApi';
import { profileKeys } from '../../../queries/keys/profile';
import { useContext } from 'react';
import { AuthContext } from '../../auth/auth-context';

export function useMyProfile() {
    const userToken = useContext(AuthContext);

    return useQuery({
        queryKey: profileKeys.me(),
        queryFn: getMyProfile,
        enabled: !!userToken,
    });
}