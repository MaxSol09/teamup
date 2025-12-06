import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useVkAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const openProfileModal = useAuthStore((s) => s.openProfileModal);
  const router = useRouter();

  return useMutation({
    mutationFn: (vkId: string) => authService.loginWithVk(vkId),

    onSuccess: (response) => {
      // axios возвращает { data: { token, user, ... }, status, headers, ... }
      // React Query передает весь ответ axios в onSuccess
      const data = response.data;
      const { token, user, isNew } = data;

      if (!token) {
        console.error('Token is missing in response:', response);
        return;
      }

      localStorage.setItem("token", token);
      setAuth(token, user);

      // ✅ ВСЕГДА идём на главную
      router.push('/')

      // ✅ если новый пользователь — откроем модалку после загрузки страницы
      if (isNew) {
        localStorage.setItem("showProfileModal", "true");
      }
    },
  });
};
