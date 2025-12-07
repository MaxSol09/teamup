import { API_ENDPOINTS } from '@/api/endpoints';
import axios from 'axios';

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

class AuthService {
  loginWithVk(vkId: string) {
    return axios.post(API_ENDPOINTS.AUTH.LOGIN, { vkId });
  }

  registerWithVk(vkId: string) {
    return axios.post(API_ENDPOINTS.AUTH.REGISTER, { vkId });
  }

async completeRegistration(payload: {
  name?: string;
  specialization?: string;
  about?: string;
  skills: string[];
  interests: string[];
  status?: string;
  isOpenForInvites?: boolean;
  socials?: { github?: string; telegram?: string };
}) {
  const token = getToken();

  const res = await axios.post(
    API_ENDPOINTS.AUTH.COMPLETE,
    payload,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data; // ✅ ВАЖНО — возвращаем только data
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