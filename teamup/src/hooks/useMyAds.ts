import { useQuery } from '@tanstack/react-query';
import { adService } from '@/services/adService';
import { Post } from '@/types/posts';

export const useMyAds = () => {
  return useQuery<Post[]>({
    queryKey: ['my-ads'],
    queryFn: async () => {
      const data = await adService.getMy();
      return data;
    },
    staleTime: 60 * 1000,
    retry: 1,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
};

