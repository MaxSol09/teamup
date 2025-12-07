import { useQuery } from '@tanstack/react-query';
import { communityService } from '@/services/communityService';
import { Community } from '@/types/communities';

export const useCommunities = () => {
  return useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: async () => {
      const data = await communityService.getAll();
      return data;
    },
    staleTime: 60 * 1000, // 1 минута
  });
};

