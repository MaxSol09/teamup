import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export const useVkAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (vkId: string) => authService.loginWithVk(vkId),
    onSuccess: ({ data }) => {
      const { token, user, isNew } = data;

      localStorage.setItem("token", token);
      setAuth(token, user);

      if (isNew) {
        console.log('необходимо заполнить доп информацию')
      } else {
        console.log('красава')
      }
    },
  });
};
