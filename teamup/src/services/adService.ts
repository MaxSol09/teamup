import axios from 'axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Post } from '@/types/posts';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export interface CreateAdPayload {
  title: string;
  description: string;
  theme: string;
  tags: string[];
}

class AdService {
  async create(payload: CreateAdPayload) {
    const token = getToken();

    return axios.post(API_ENDPOINTS.AD.CREATE, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  async getAll(): Promise<Post[]> {
    const token = getToken();
    
    const response = await axios.get(API_ENDPOINTS.AD.GET_ALL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async getMy(): Promise<Post[]> {
    const token = getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await axios.get(API_ENDPOINTS.AD.GET_MY, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }
}

export const adService = new AdService();
