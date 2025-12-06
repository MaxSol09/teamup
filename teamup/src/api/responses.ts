/**
 * API слой для работы с откликами
 * Централизованное место для всех запросов к backend
 * Легко заменить mock-данные на реальные API вызовы
 */

import { OwnerResponsesDTO, MyResponseDTO, Response, RecommendedUser, ResponseStatus } from '@/types/responses';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Получить список моих сущностей с метаданными об откликах
 * GET /api/responses/my-items
 * Возвращает упрощённый список для главной страницы /responses
 */
export async function fetchMyItems(): Promise<Array<{
  _id: string;
  type: 'post' | 'project' | 'community';
  title: string;
  theme: string;
  tags: string[];
  totalResponses: number; // вычисляется на бэке
  newResponses: number; // вычисляется на бэке
  createdAt: string;
}>> {
  // TODO: Заменить на реальный API вызов
  // const response = await fetch(`${API_BASE_URL}/responses/my-items`);
  // if (!response.ok) throw new Error('Failed to fetch my items');
  // return response.json();

  // Mock данные
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      _id: 'post-1',
      type: 'post',
      title: 'Ищем фронтенд-разработчика для стартапа',
      theme: 'IT',
      tags: ['React', 'Next.js', 'TypeScript'],
      totalResponses: 5,
      newResponses: 3,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      _id: 'project-1',
      type: 'project',
      title: 'E-commerce платформа',
      theme: 'IT',
      tags: ['E-commerce', 'Next.js', 'Node.js'],
      totalResponses: 12,
      newResponses: 7,
      createdAt: '2024-01-10T12:00:00Z',
    },
    {
      _id: 'community-1',
      type: 'community',
      title: 'Сообщество React разработчиков',
      theme: 'IT',
      tags: ['React', 'Разработка'],
      totalResponses: 0,
      newResponses: 0,
      createdAt: '2024-01-05T08:00:00Z',
    },
    {
      _id: 'post-2',
      type: 'post',
      title: 'Ищу UX/UI дизайнера',
      theme: 'Творчество',
      tags: ['UI/UX', 'Дизайн'],
      totalResponses: 2,
      newResponses: 2,
      createdAt: '2024-01-20T14:00:00Z',
    },
  ];
}

/**
 * Получить данные для страницы владельца с откликами
 * GET /api/responses/:type/:id
 * Возвращает OwnerResponsesDTO
 */
export async function fetchOwnerResponses(type: string, id: string): Promise<OwnerResponsesDTO> {
  // TODO: Заменить на реальный API вызов
  // const response = await fetch(`${API_BASE_URL}/responses/${type}/${id}`);
  // if (!response.ok) throw new Error('Failed to fetch owner responses');
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 300));

  const mockData: Record<string, OwnerResponsesDTO> = {
    'post-1': {
      target: {
        _id: 'post-1',
        title: 'Ищем фронтенд-разработчика для стартапа',
        type: 'post',
        theme: 'IT',
        tags: ['React', 'Next.js', 'TypeScript'],
        createdAt: '2024-01-15T10:00:00Z',
      },
      responses: [
        {
          _id: 'resp-1',
          user: {
            _id: 'user-2',
            name: 'Мария Петрова',
            avatar: '',
            specialization: 'Frontend Developer',
          },
          targetType: 'post',
          targetId: 'post-1',
          message: 'Интересуюсь вакансией, есть опыт работы с React и Next.js более 3 лет. Готов присоединиться к команде.',
          status: 'pending',
          createdAt: '2024-01-16T14:30:00Z',
        },
        {
          _id: 'resp-2',
          user: {
            _id: 'user-3',
            name: 'Иван Сидоров',
            avatar: '',
            specialization: 'Fullstack Developer',
          },
          targetType: 'post',
          targetId: 'post-1',
          message: 'Готов присоединиться к команде. Имею опыт в разработке e-commerce решений.',
          status: 'pending',
          createdAt: '2024-01-17T09:15:00Z',
        },
        {
          _id: 'resp-3',
          user: {
            _id: 'user-4',
            name: 'Анна Козлова',
            avatar: '',
            specialization: 'React Developer',
          },
          targetType: 'post',
          targetId: 'post-1',
          message: 'Хочу участвовать в проекте',
          status: 'accepted',
          createdAt: '2024-01-12T16:20:00Z',
          chatId: 'chat-1',
        },
        {
          _id: 'resp-4',
          user: {
            _id: 'user-5',
            name: 'Дмитрий Волков',
            avatar: '',
            specialization: 'Backend Developer',
          },
          targetType: 'post',
          targetId: 'post-1',
          message: 'Интересный проект, готов обсудить детали',
          status: 'rejected',
          createdAt: '2024-01-11T10:00:00Z',
        },
      ],
      recommendedUsers: [
        {
          _id: 'user-6',
          name: 'Елена Смирнова',
          avatar: '',
          specialization: 'Frontend Developer',
          skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
          interests: ['IT', 'UI/UX'],
          matchScore: 95,
        },
        {
          _id: 'user-7',
          name: 'Алексей Новиков',
          avatar: '',
          specialization: 'Fullstack Developer',
          skills: ['React', 'Node.js', 'MongoDB', 'Express'],
          interests: ['IT', 'Backend'],
          matchScore: 87,
        },
        {
          _id: 'user-8',
          name: 'Ольга Иванова',
          avatar: '',
          specialization: 'React Developer',
          skills: ['React', 'Redux', 'TypeScript'],
          interests: ['IT'],
          matchScore: 82,
        },
      ],
    },
    'project-1': {
      target: {
        _id: 'project-1',
        title: 'E-commerce платформа',
        type: 'project',
        theme: 'IT',
        tags: ['E-commerce', 'Next.js', 'Node.js'],
        createdAt: '2024-01-10T12:00:00Z',
      },
      responses: [],
      recommendedUsers: [],
    },
    'community-1': {
      target: {
        _id: 'community-1',
        title: 'Сообщество React разработчиков',
        type: 'community',
        theme: 'IT',
        tags: ['React', 'Разработка'],
        createdAt: '2024-01-05T08:00:00Z',
      },
      responses: [],
      recommendedUsers: [],
    },
  };

  return mockData[id] || mockData['post-1'];
}

/**
 * Получить отклики текущего пользователя
 * GET /api/responses/my
 * Возвращает MyResponseDTO[]
 */
export async function fetchMyResponses(): Promise<MyResponseDTO[]> {
  // TODO: Заменить на реальный API вызов
  // const response = await fetch(`${API_BASE_URL}/responses/my`);
  // if (!response.ok) throw new Error('Failed to fetch my responses');
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 500));

  const mockResponses: MyResponseDTO[] = [
    {
      _id: 'my-resp-1',
      target: {
        _id: 'post-1',
        type: 'post',
        title: 'Ищем фронтенд-разработчика для стартапа',
        owner: {
          _id: 'user-1',
          name: 'Андрей Петров',
          avatar: '',
        },
      },
      message: 'Интересуюсь вакансией, есть опыт работы с React и Next.js более 3 лет.',
      status: 'pending',
      createdAt: '2024-01-16T14:30:00Z',
    },
    {
      _id: 'my-resp-2',
      target: {
        _id: 'project-1',
        type: 'project',
        title: 'E-commerce платформа',
        owner: {
          _id: 'user-2',
          name: 'Мария Сидорова',
          avatar: '',
        },
      },
      message: 'Готов присоединиться к команде. Имею опыт в разработке e-commerce решений.',
      status: 'accepted',
      createdAt: '2024-01-12T09:15:00Z',
      chatId: 'chat-1',
    },
    {
      _id: 'my-resp-3',
      target: {
        _id: 'community-1',
        type: 'community',
        title: 'Сообщество React разработчиков',
        owner: {
          _id: 'user-3',
          name: 'Иван Козлов',
          avatar: '',
        },
      },
      message: 'Хочу присоединиться к сообществу',
      status: 'rejected',
      createdAt: '2024-01-10T16:20:00Z',
    },
    {
      _id: 'my-resp-4',
      target: {
        _id: 'post-2',
        type: 'post',
        title: 'Ищу UX/UI дизайнера',
        owner: {
          _id: 'user-4',
          name: 'Анна Волкова',
          avatar: '',
        },
      },
      message: 'Интересный проект, готов обсудить детали',
      status: 'pending',
      createdAt: '2024-01-18T11:00:00Z',
    },
  ];

  return mockResponses;
}

/**
 * Принять отклик
 * POST /api/responses/:id/accept
 */
export async function acceptResponse(responseId: string): Promise<{ chatId: string }> {
  // TODO: Заменить на реальный API вызов
  // const response = await fetch(`${API_BASE_URL}/responses/${responseId}/accept`, {
  //   method: 'POST',
  // });
  // if (!response.ok) throw new Error('Failed to accept response');
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 300));
  return { chatId: `chat-${responseId}` };
}

/**
 * Отклонить отклик
 * POST /api/responses/:id/reject
 */
export async function rejectResponse(responseId: string): Promise<void> {
  // TODO: Заменить на реальный API вызов
  // const response = await fetch(`${API_BASE_URL}/responses/${responseId}/reject`, {
  //   method: 'POST',
  // });
  // if (!response.ok) throw new Error('Failed to reject response');

  await new Promise(resolve => setTimeout(resolve, 300));
}
