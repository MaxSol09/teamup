import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";


export const useVkRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (vkId: string) => authService.registerWithVk(vkId),

    onSuccess: ({ data }) => {
      const { token, user } = data;
      
      localStorage.setItem("token", token);
      setAuth(token, user);

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
  });
};
