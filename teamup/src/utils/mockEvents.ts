import { Event } from '@/types/events';
import { UserStatus } from '@/types/user';

// Моковые данные для тестирования
export const mockEvents: Event[] = [
  {
    _id: '1',
    title: 'Встреча разработчиков React',
    description: 'Неформальная встреча для обмена опытом, обсуждения новых технологий и поиска единомышленников для совместных проектов. Приглашаем всех, кто интересуется React и современной фронтенд-разработкой.',
    theme: 'Айти',
    tags: ['React', 'Frontend', 'JavaScript', 'TypeScript'],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Через неделю
    createdBy: {
      _id: 'admin1',
      name: 'Администратор',
      avatar: undefined,
    },
    participantsCount: 15,
    likeMindedCount: 8,
    participantsWithMatchingStatus: 12,
    participantsByStatus: {
      'Ищу проект': 3,
      'Ищу команду': 5,
      'Ищу исполнителей': 2,
      'Открыт к предложениям': 4,
      'Не ищу сотрудничество': 1,
    },
    isParticipant: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    title: 'Хакатон по машинному обучению',
    description: 'Двухдневный хакатон для разработчиков, интересующихся машинным обучением и искусственным интеллектом. Будем решать реальные задачи и создавать интересные проекты.',
    theme: 'Наука',
    tags: ['Python', 'ML', 'AI', 'Data Science'],
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Через 2 недели
    createdBy: {
      _id: 'admin1',
      name: 'Администратор',
      avatar: undefined,
    },
    participantsCount: 23,
    likeMindedCount: 15,
    participantsWithMatchingStatus: 18,
    participantsByStatus: {
      'Ищу проект': 6,
      'Ищу команду': 8,
      'Ищу исполнителей': 3,
      'Открыт к предложениям': 5,
      'Не ищу сотрудничество': 1,
    },
    isParticipant: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    title: 'Воркшоп по дизайну интерфейсов',
    description: 'Практический воркшоп по созданию современных UI/UX дизайнов. Изучим тренды, инструменты и лучшие практики. Подходит как для начинающих, так и для опытных дизайнеров.',
    theme: 'Творчество',
    tags: ['UI/UX', 'Дизайн', 'Figma', 'Прототипирование'],
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Через 3 дня
    createdBy: {
      _id: 'admin1',
      name: 'Администратор',
      avatar: undefined,
    },
    participantsCount: 9,
    likeMindedCount: 4,
    participantsWithMatchingStatus: 7,
    participantsByStatus: {
      'Ищу проект': 2,
      'Ищу команду': 3,
      'Ищу исполнителей': 1,
      'Открыт к предложениям': 2,
      'Не ищу сотрудничество': 1,
    },
    isParticipant: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    title: 'Стартап-митап: Презентация проектов',
    description: 'Мероприятие для стартаперов и предпринимателей. Каждый участник может презентовать свой проект, получить обратную связь и найти партнеров или инвесторов.',
    theme: 'Бизнес',
    tags: ['Стартап', 'MVP', 'Бизнес', 'Презентация'],
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Через 10 дней
    createdBy: {
      _id: 'admin1',
      name: 'Администратор',
      avatar: undefined,
    },
    participantsCount: 18,
    likeMindedCount: 11,
    participantsWithMatchingStatus: 14,
    participantsByStatus: {
      'Ищу проект': 4,
      'Ищу команду': 6,
      'Ищу исполнителей': 2,
      'Открыт к предложениям': 5,
      'Не ищу сотрудничество': 1,
    },
    isParticipant: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    title: 'Изучение Next.js 14',
    description: 'Образовательный воркшоп по изучению новых возможностей Next.js 14. Разберем Server Components, App Router и другие нововведения. Практические примеры и решение задач.',
    theme: 'Учёба',
    tags: ['Next.js', 'React', 'Обучение', 'Web Development'],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Через 5 дней
    createdBy: {
      _id: 'admin1',
      name: 'Администратор',
      avatar: undefined,
    },
    participantsCount: 12,
    likeMindedCount: 7,
    participantsWithMatchingStatus: 9,
    participantsByStatus: {
      'Ищу проект': 2,
      'Ищу команду': 4,
      'Ищу исполнителей': 1,
      'Открыт к предложениям': 4,
      'Не ищу сотрудничество': 1,
    },
    isParticipant: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Функция для получения статусов, подходящих для текущего пользователя
export const getMatchingStatuses = (userStatus?: string): UserStatus[] => {
  // Если пользователь ищет проект или команду, ему подходят люди с такими же статусами
  if (userStatus === 'Ищу проект') {
    return ['Ищу проект', 'Ищу команду', 'Открыт к предложениям'];
  }
  if (userStatus === 'Ищу команду') {
    return ['Ищу команду', 'Ищу проект', 'Открыт к предложениям'];
  }
  if (userStatus === 'Ищу исполнителей') {
    return ['Ищу исполнителей', 'Открыт к предложениям'];
  }
  // По умолчанию подходят все открытые статусы
  return ['Ищу проект', 'Ищу команду', 'Открыт к предложениям'];
};

