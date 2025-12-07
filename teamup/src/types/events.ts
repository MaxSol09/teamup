import { UserStatus } from './user';

export interface Event {
  _id: string;
  title: string;
  description: string;
  theme: string;
  tags: string[];
  date: string;
  createdBy: {
    _id: string;
    name: string;
    avatar?: string;
  };
  participantsCount: number;
  likeMindedCount: number;
  participantsWithMatchingStatus?: number; // Количество участников с подходящим статусом
  participantsByStatus?: Record<UserStatus, number>; // Статистика по статусам участников
  isParticipant?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  theme: string;
  tags?: string[];
  date: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  theme?: string;
  tags?: string[];
  date?: string;
}

