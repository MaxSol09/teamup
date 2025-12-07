import axios from 'axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Project } from '@/types/project';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export interface CreateProjectPayload {
  title: string;
  description: string;
  theme: string;
  tags: string[];
}

class ProjectService {
  async create(payload: CreateProjectPayload) {
    const token = getToken();

    return axios.post(API_ENDPOINTS.PROJECT.CREATE, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  async getAll(): Promise<Project[]> {
    const token = getToken();
    
    const response = await axios.get(API_ENDPOINTS.PROJECT.GET_ALL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async getMy(): Promise<Project[]> {
    const token = getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await axios.get(API_ENDPOINTS.PROJECT.GET_MY, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }
}

export const projectService = new ProjectService();