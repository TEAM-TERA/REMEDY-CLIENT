import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileImage } from '../api/profileApi';

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'my'] });
      console.log('프로필 이미지 업데이트 성공:', data);
    },
    onError: (error) => {
      console.error('프로필 이미지 업데이트 실패:', error);
    },
  });
};