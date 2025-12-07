import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';

export const useMyProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['my-projects'],
    queryFn: async () => {
      const data = await projectService.getMy();
      return data;
    },
    staleTime: 60 * 1000,
    retry: 1,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
};

