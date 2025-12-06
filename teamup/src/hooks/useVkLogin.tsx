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

    onSuccess: ({ data }) => {
      const { token, user, isNew } = data;

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
