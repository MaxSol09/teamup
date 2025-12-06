import axios from 'axios';

class AuthService {
  loginWithVk(vkId: string) {
    return axios.post('/api/auth/vk/login', { vkId });
  }

  registerWithVk(vkId: string) {
    return axios.post('/api/auth/vk/register', { vkId });
  }

  getMe(token: string) {
    return axios.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};


export const authService = new AuthService()