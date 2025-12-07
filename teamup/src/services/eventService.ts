import { API_ENDPOINTS } from '@/api/endpoints';
import axios from 'axios';
import { Event, CreateEventData, UpdateEventData } from '@/types/events';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

class EventService {
  async getAll(): Promise<Event[]> {
    const token = getToken();
    
    const response = await axios.get(API_ENDPOINTS.EVENT.GET_ALL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async getMy(): Promise<Event[]> {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    const response = await axios.get(API_ENDPOINTS.EVENT.GET_MY, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async create(data: CreateEventData): Promise<Event> {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    const response = await axios.post(API_ENDPOINTS.EVENT.CREATE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async join(id: string): Promise<Event> {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    const response = await axios.post(API_ENDPOINTS.EVENT.JOIN(id), {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async leave(id: string): Promise<Event> {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    const response = await axios.post(API_ENDPOINTS.EVENT.LEAVE(id), {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async update(id: string, data: UpdateEventData): Promise<Event> {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    const response = await axios.put(API_ENDPOINTS.EVENT.UPDATE(id), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }

  async delete(id: string): Promise<void> {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    await axios.delete(API_ENDPOINTS.EVENT.DELETE(id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getParticipants(id: string) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Не авторизован');
    }
    
    const response = await axios.get(API_ENDPOINTS.EVENT.GET_PARTICIPANTS(id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }
}

export const eventService = new EventService();


