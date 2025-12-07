import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useRouter } from 'next/router';

export const useCompleteRegistration = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: Parameters<typeof authService.completeRegistration>[0]) =>
      authService.completeRegistration(payload),
    onSuccess: (data) => {
      // ответ: { user }
      const { user } = data;
      setUser(user);
      // Закрыть модалку/редирект
      router.push('/');
    },
    onError: (err: any) => {
      console.error('complete registration error', err);
    },
  });
};