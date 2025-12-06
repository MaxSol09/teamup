import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type VkLoginPayload = {
  vkId: string;
  name?: string;
  email?: string;
  avatar?: string;
};

type VkLoginResponse = {
  token: string;
  user: any; // можешь заменить на User если импортируешь тип
};

export const useVkLogin = () => {
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  return useMutation<VkLoginResponse, Error, VkLoginPayload>({
    mutationFn: (payload) => authService.loginWithVk(payload),

    onSuccess: (data) => {
      const { token, user } = data;

      setToken(token);
      setUser(user);

      if (!user.isProfileCompleted) {
        router.push('/profile/edit');
      } else {
        router.push('/');
      }
    },

    onError: (err) => {
      console.error('VK login error:', err);
    },
  });
};