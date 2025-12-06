export type UserStatus = 'Ищу проект' | 'Ищу команду' | 'Ищу исполнителей' | 'Открыт к предложениям' | 'Не ищу сотрудничество';

export interface UserSocials {
  github?: string;
  telegram?: string;
}

export interface User {
  _id: string;

  vkId: string;

  name?: string;
  avatar?: string;

  specialization?: string; // НЕобязательная (школьник и т.п.)
  about?: string;
  interests: string[];

  skills: string[];

  status: UserStatus;

  socials?: UserSocials;

  isProfileCompleted: boolean;

  createdAt: string;
  updatedAt: string;
}