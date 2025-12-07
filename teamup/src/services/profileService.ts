import axios from 'axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { User } from '@/types/user';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export interface UpdateProfilePayload {
  name?: string;
  specialization?: string;
  about?: string;
  skills?: string[];
  interests?: string[];
  status?: User['status'];
  isOpenForInvites?: boolean;
  socials?: {
    github?: string;
    telegram?: string;
  };
}

export interface UpdateProfileResponse {
  user: User;
}

class ProfileService {
  async getMe(): Promise<User> {
    const token = getToken();
    const response = await axios.get<User>(API_ENDPOINTS.AUTH.GET_ME, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse> {
    const token = getToken();
    const response = await axios.put<UpdateProfileResponse>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      payload,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }
}

export const profileService = new ProfileService();

