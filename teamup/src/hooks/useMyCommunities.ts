import { useQuery } from '@tanstack/react-query';
import { communityService } from '@/services/communityService';
import { Community } from '@/types/communities';

export const useMyCommunities = () => {
  return useQuery<Community[]>({
    queryKey: ['my-communities'],
    queryFn: async () => {
      const data = await communityService.getMy();
      return data;
    },
    staleTime: 60 * 1000,
    retry: 1,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
};

