import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";



export const useVkRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (vkId: string) => authService.registerWithVk(vkId),

    onSuccess: ({ data }) => {
      setAuth(data.token, data.user);
      router.push('/');
    },
  });
};