import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useVkRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

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
      
      // ✅ ВАЖНО: localStorage.setItem выполняется в контексте основного окна,
      // а не popup окна, так как мы используем postMessage
      localStorage.setItem("token", token);
      setAuth(token, user);

      // ✅ Редирект на главную после успешной регистрации
      router.push('/');
    },
  });
};
