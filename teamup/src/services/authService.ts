import { API_ENDPOINTS } from '@/api/endpoints';
import axios from 'axios';

class AuthService {
  loginWithVk(vkId: string) {
    return axios.post(API_ENDPOINTS.AUTH.LOGIN, { vkId });
  }

  registerWithVk(vkId: string) {
    return axios.post(API_ENDPOINTS.AUTH.REGISTER, { vkId });
  }

  getMe(token: string) {
    return axios.get(API_ENDPOINTS.AUTH.GET_ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};


export const authService = new AuthService()