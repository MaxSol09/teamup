import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { User } from '@/types/user';

export const useMe = () => {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const user = await profileService.getMe();
      return user;
    },
    staleTime: 60 * 1000,
    retry: 1,
  });
};


