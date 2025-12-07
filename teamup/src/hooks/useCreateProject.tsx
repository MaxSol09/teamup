import { useState } from 'react';
import { projectService, CreateProjectPayload } from '@/services/projectService';

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createProject = async (payload: CreateProjectPayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { data } = await projectService.create(payload);

      setSuccess(true);
      return data;
    } catch (e: any) {
      const message =
        e?.response?.data?.message || 'Ошибка при создании проекта';

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProject,
    loading,
    error,
    success,
  };
};
