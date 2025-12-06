import { useMutation } from '@tanstack/react-query';
import { userService, CompleteProfileData } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { AxiosError } from 'axios';

export const useCompleteProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const closeProfileModal = useAuthStore((state) => state.closeProfileModal);

  return useMutation({
    mutationFn: (data: CompleteProfileData) => userService.completeProfile(data),
    onSuccess: (response) => {
      // Обновляем пользователя в Zustand
      setUser(response.user);
      
      // Закрываем модалку
      closeProfileModal();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Ошибка при заполнении профиля:', error);
      
      // Можно добавить toast-уведомление об ошибке
      const errorMessage = error.response?.data?.message || 'Произошла ошибка при сохранении профиля';
      alert(errorMessage);
    },
  });
};

