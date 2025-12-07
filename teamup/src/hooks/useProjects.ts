import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await projectService.getAll();
      return data;
    },
    staleTime: 60 * 1000, // 1 минута
  });
};

