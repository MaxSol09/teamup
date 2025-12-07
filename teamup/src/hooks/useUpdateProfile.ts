import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, UpdateProfilePayload } from '@/services/profileService';
import { User } from '@/types/user';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await profileService.updateProfile(payload);
      return response.user;
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(['me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};


