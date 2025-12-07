import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { User, UserStatus, UserSocials } from '@/types/user';

export interface CompleteProfileData {
  name: string; // обязательно
  specialization?: string; // необязательно (школьники)
  about?: string; // необязательно (рекомендуемое)
  skills: string[];
  interests: string[];
  status: UserStatus;
  isOpenForInvites: boolean;
  socials?: UserSocials;
}

export interface CompleteProfileResponse {
  user: User;
}

class UserService {
  async completeProfile(data: CompleteProfileData): Promise<CompleteProfileResponse> {
    const response = await api.patch<CompleteProfileResponse>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<CompleteProfileResponse> {
    const response = await api.patch<CompleteProfileResponse>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    return response.data;
  }
}

export const userService = new UserService();

