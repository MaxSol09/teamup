/**
 * Типы данных для системы откликов
 * Нормализованная архитектура: модель + DTO
 */

export type ResponseStatus = 'pending' | 'accepted' | 'rejected';
export type TargetType = 'post' | 'project' | 'community';

/**
 * Базовая модель отклика
 * Единственная модель для всех откликов в системе
 */
export interface Response {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    specialization?: string;
  };
  targetType: TargetType;
  targetId: string;
  message?: string;
  status: ResponseStatus;
  chatId?: string; // появляется ТОЛЬКО при accepted
  createdAt: string;
}

/**
 * DTO для страницы владельца
 * Используется на /responses/:type/:id
 */
export interface OwnerResponsesDTO {
  target: {
    _id: string;
    title: string;
    type: TargetType;
    theme: string;
    tags: string[];
    createdAt: string;
  };
  responses: Response[];
  recommendedUsers: RecommendedUser[];
}

/**
 * Тип для элемента владельца с откликами
 * Используется для отображения постов/проектов/сообществ с их откликами
 */
export interface OwnerItem {
  _id: string;
  title: string;
  theme: string;
  description?: string;
  responses: Response[];
}

/**
 * DTO для страницы "Мои отклики"
 * Используется в профиле пользователя
 */
export interface MyResponseDTO {
  _id: string;
  target: {
    _id: string;
    type: TargetType;
    title: string;
    owner: {
      _id: string;
      name: string;
      avatar?: string;
    };
  };
  message?: string;
  status: ResponseStatus;
  chatId?: string;
  createdAt: string;
}

/**
 * Модель рекомендованных пользователей
 * ТОЛЬКО для UI, не связана напрямую с откликами
 */
export interface RecommendedUser {
  _id: string;
  name: string;
  avatar?: string;
  specialization?: string;
  skills: string[];
  interests: string[];
  matchScore: number; // 0–100
}
