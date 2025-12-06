import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useVkLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (vkId: string) => authService.loginWithVk(vkId),

    onSuccess: ({ data }) => {
      if (!data.isRegistered) {
        router.push('/auth/complete-profile');
      } else {
        setAuth(data.token, data.user);
        router.push('/');
      }
    },
  });
};
