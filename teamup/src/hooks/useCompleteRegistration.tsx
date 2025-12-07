import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export const useCompleteRegistration = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const closeModal = useAuthStore(s => s.closeProfileModal)
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: Parameters<typeof authService.completeRegistration>[0]) =>
      authService.completeRegistration(payload),
    onSuccess: (data) => {
      // ответ: { user }
      const { user } = data;
      setUser(user);

      closeModal()
      // Закрыть модалку/редирект
    },
    onError: (err: any) => {
      console.error('complete registration error', err);
    },
  });
};