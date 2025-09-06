// src/modules/profile/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyProfile } from '../api/profileApi';
import { profileKeys } from '../../../queries/keys/profile';
import type { Profile, UpdateProfilePayload } from '../types/profile';

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: profileKeys.me() });
      const prev = qc.getQueryData<Profile>(profileKeys.me());
      if (prev) qc.setQueryData(profileKeys.me(), { ...prev, ...payload });
      return { prev };
    },

    onError: (_e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(profileKeys.me(), ctx.prev);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.me(), exact: true });
    },
  });
}
