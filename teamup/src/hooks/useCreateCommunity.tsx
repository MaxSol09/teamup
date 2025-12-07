import { useState } from 'react';
import { communityService, CreateCommunityPayload } from '@/services/communityService';

export const useCreateCommunity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createCommunity = async (payload: CreateCommunityPayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { data } = await communityService.create(payload);

      setSuccess(true);
      return data;
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        'Ошибка при создании сообщества';

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCommunity,
    loading,
    error,
    success
  };
};