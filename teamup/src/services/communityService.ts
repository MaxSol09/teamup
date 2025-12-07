import axios from 'axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Community } from '@/types/communities';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export interface CreateCommunityPayload {
  title: string;
  description: string;
  theme: string;
  tags?: string[];
  isPublic?: boolean;
}

class CommunityService {
  async create(payload: CreateCommunityPayload) {
    const token = getToken();

    return axios.post(API_ENDPOINTS.COMMUNITY.CREATE, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
  }

  async getAll(): Promise<Community[]> {
    const token = getToken();
    
    const response = await axios.get(API_ENDPOINTS.COMMUNITY.GET_ALL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async getMy(): Promise<Community[]> {
    const token = getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await axios.get(API_ENDPOINTS.COMMUNITY.GET_MY, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }
}

export const communityService = new CommunityService();