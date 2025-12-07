import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { Event, CreateEventData, UpdateEventData } from '@/types/events';
import { UserStatus } from '@/types/user';

// Моковые тестовые мероприятия для демонстрации
const getMockEvents = (): Event[] => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Моковые участники с разными статусами
  const mockParticipants1 = [
    { status: 'Открыт к предложениям' as UserStatus },
    { status: 'Ищу команду' as UserStatus },
    { status: 'Ищу команду' as UserStatus },
    { status: 'Ищу проект' as UserStatus },
    { status: 'Открыт к предложениям' as UserStatus },
    { status: 'Не ищу сотрудничество' as UserStatus },
  ];

  const mockParticipants2 = [
    { status: 'Ищу команду' as UserStatus },
    { status: 'Ищу команду' as UserStatus },
    { status: 'Ищу исполнителей' as UserStatus },
    { status: 'Открыт к предложениям' as UserStatus },
    { status: 'Открыт к предложениям' as UserStatus },
    { status: 'Открыт к предложениям' as UserStatus },
    { status: 'Ищу проект' as UserStatus },
  ];

  const mockParticipants3 = [
    { status: 'Открыт к предложениям' as UserStatus },
    { status: 'Ищу команду' as UserStatus },
    { status: 'Не ищу сотрудничество' as UserStatus },
  ];

  // Функция для подсчета участников с нужным статусом
  const getParticipantsWithMatchingStatus = (participants: { status: UserStatus }[]) => {
    return participants.filter(p => 
      p.status === 'Открыт к предложениям' || p.status === 'Ищу команду'
    ).length;
  };

  const getParticipantsByStatus = (participants: { status: UserStatus }[]) => {
    const statuses: Record<UserStatus, number> = {
      'Ищу проект': 0,
      'Ищу команду': 0,
      'Ищу исполнителей': 0,
      'Открыт к предложениям': 0,
      'Не ищу сотрудничество': 0,
    };
    participants.forEach(p => {
      statuses[p.status] = (statuses[p.status] || 0) + 1;
    });
    return statuses;
  };

  return [
    {
      _id: 'mock-event-1',
      title: 'Hackathon 2024: Разработка мобильных приложений',
      description: 'Присоединяйтесь к хакатону по разработке мобильных приложений. Участники будут работать в командах и создавать инновационные решения.',
      theme: 'Технологии',
      tags: ['React Native', 'Flutter', 'Мобильная разработка'],
      date: nextWeek.toISOString(),
      createdBy: {
        _id: 'mock-creator-1',
        name: 'Организатор Hackathon',
        avatar: undefined,
      },
      participantsCount: mockParticipants1.length,
      likeMindedCount: 3,
      participantsWithMatchingStatus: getParticipantsWithMatchingStatus(mockParticipants1),
      participantsByStatus: getParticipantsByStatus(mockParticipants1),
      isParticipant: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: 'mock-event-2',
      title: 'Встреча разработчиков: Обмен опытом',
      description: 'Неформальная встреча разработчиков для обмена опытом, обсуждения новых технологий и поиска единомышленников для будущих проектов.',
      theme: 'Сообщество',
      tags: ['Встреча', 'Нетворкинг', 'Разработка'],
      date: nextMonth.toISOString(),
      createdBy: {
        _id: 'mock-creator-2',
        name: 'Сообщество разработчиков',
        avatar: undefined,
      },
      participantsCount: mockParticipants2.length,
      likeMindedCount: 5,
      participantsWithMatchingStatus: getParticipantsWithMatchingStatus(mockParticipants2),
      participantsByStatus: getParticipantsByStatus(mockParticipants2),
      isParticipant: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: 'mock-event-3',
      title: 'Мастер-класс по UI/UX дизайну',
      description: 'Практический мастер-класс по созданию пользовательских интерфейсов. Узнайте о последних трендах в дизайне и познакомьтесь с дизайнерами.',
      theme: 'Дизайн',
      tags: ['UI/UX', 'Figma', 'Дизайн'],
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: {
        _id: 'mock-creator-3',
        name: 'Дизайн-студия',
        avatar: undefined,
      },
      participantsCount: mockParticipants3.length,
      likeMindedCount: 2,
      participantsWithMatchingStatus: getParticipantsWithMatchingStatus(mockParticipants3),
      participantsByStatus: getParticipantsByStatus(mockParticipants3),
      isParticipant: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      // Для теста возвращаем моковые данные
      // В продакшене можно раскомментировать строку ниже и закомментировать возврат моков
      // const data = await eventService.getAll();
      // return data;
      
      // Временно возвращаем моковые данные для теста
      const mockData = getMockEvents();
      
      // Также пытаемся загрузить реальные данные и объединить
      try {
        const realData = await eventService.getAll();
        return [...mockData, ...realData];
      } catch (error) {
        // Если сервер недоступен, возвращаем только моки
        console.log('Используются тестовые данные мероприятий');
        return mockData;
      }
    },
    staleTime: 60 * 1000, // 1 минута
  });
};

export const useMyEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['events', 'my'],
    queryFn: async () => {
      const data = await eventService.getMy();
      return data;
    },
    staleTime: 60 * 1000,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
};

export const useJoinEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'my'] });
    },
  });
};

export const useLeaveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'my'] });
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'my'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'my'] });
    },
  });
};


