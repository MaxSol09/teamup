
import { adService, CreateAdPayload } from '@/services/adService';
import { useState } from 'react';

const getErrorMessage = (error: any): string => {
  // Если есть сообщение от сервера
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Обработка различных HTTP статусов
  const status = error?.response?.status;
  if (status === 400) {
    return 'Неверные данные. Проверьте заполненные поля.';
  }
  if (status === 401) {
    return 'Необходима авторизация. Пожалуйста, войдите в систему.';
  }
  if (status === 403) {
    return 'Недостаточно прав для выполнения этого действия.';
  }
  if (status === 404) {
    return 'Сервер не найден. Проверьте подключение к интернету.';
  }
  if (status === 500) {
    return 'Ошибка на сервере. Попробуйте позже.';
  }
  if (status === 503) {
    return 'Сервис временно недоступен. Попробуйте позже.';
  }

  // Обработка сетевых ошибок
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Превышено время ожидания. Проверьте подключение к интернету.';
  }
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Ошибка сети. Проверьте подключение к интернету.';
  }

  // Общая ошибка
  return 'Ошибка при создании объявления. Попробуйте еще раз.';
};

export const useCreateAd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createAd = async (payload: CreateAdPayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { data } = await adService.create(payload);

      setSuccess(true);
      return data;
    } catch (e: any) {
      const message = getErrorMessage(e);
      setError(message);
      
      // Не пробрасываем ошибку дальше, чтобы не ломать приложение
      // Вместо этого возвращаем null и показываем ошибку через state
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    createAd,
    loading,
    error,
    success,
    clearError,
  };
};