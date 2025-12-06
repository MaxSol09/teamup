import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";


export const useVkRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const openProfileModal = useAuthStore((s) => s.openProfileModal);

  return useMutation({
    mutationFn: (vkId: string) => authService.registerWithVk(vkId),

    onSuccess: (response) => {
      // axios возвращает { data: { token, user, ... }, status, headers, ... }
      // React Query передает весь ответ axios в onSuccess
      const data = response.data;
      const { token, user } = data;
      
      if (!token) {
        console.error('Token is missing in response:', response);
        return;
      }
      
      localStorage.setItem("token", token);
      setAuth(token, user);

      // ✅ Если профиль не заполнен (всегда при регистрации), показываем модалку
      if (user && !user.isProfileCompleted) {
        openProfileModal();
      }

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
  });
};
