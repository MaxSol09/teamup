import { User } from '@/types/user';
import { create } from 'zustand';

export type TabType = 'posts' | 'projects' | 'communities' | 'my-responses';


export interface ProfileStore {
  user: User;
  isEditing: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  toggleEdit: () => void;
  updateUser: (user: Partial<User>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
}

const initialUser: User = {
  _id: '3g3g',
  name: 'Александр Иванов',
  specialization: 'Фронтенд-разработчик',
  about: 'Фронтенд-разработчик с опытом работы над современными веб-приложениями. Увлекаюсь React, TypeScript и созданием пользовательских интерфейсов.',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  socials: {
    github: 'https://github.com/alexivanov',
    telegram: 'https://telegram.com'
  },
  isProfileCompleted: true,
  interests:[],
  vkId: '48324273',
  status: 'Ищу команду',
  updatedAt: '42847',
  createdAt: '8ubbubu',
  avatar: '',
};


export const useProfileStore = create<ProfileStore>((set) => ({
  user: initialUser,
  isEditing: false,
  activeTab: 'posts',
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleEdit: () => set((state) => ({ isEditing: !state.isEditing })),
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
  addSkill: (skill) =>
    set((state) => ({
      user: {
        ...state.user,
        skills: [...state.user.skills, skill],
      },
    })),
  removeSkill: (skill) =>
    set((state) => ({
      user: {
        ...state.user,
        skills: state.user.skills.filter((s) => s !== skill),
      },
    })),
}));
