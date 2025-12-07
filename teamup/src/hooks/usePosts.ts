import { useQuery } from '@tanstack/react-query';
import { postsService } from '@/services/postsService';
import { Post } from '@/types/posts';

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const data = await postsService.getAll();
      return data;
    },
    staleTime: 60 * 1000, // 1 минута
  });
};

