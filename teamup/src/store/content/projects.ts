
import { Project } from "@/types/project";
import { create } from "zustand";

interface ProjectStore {
    projects: Project[]
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projects: [
        {
            _id: 'p1',
            title: 'Сайт на React для стартапа',
            description: 'Ищем фронтенд-разработчика для создания лендинга. Дизайн готов в Figma. Проект интересный, есть возможность работать с современным стеком и влиять на продукт.',
            theme: 'Айти',
            tags: ['React', 'Figma', 'Frontend', 'Лендинг'],
            owner: {
            _id: 'u1',
            name: 'Артём',
            avatar: '/avatars/artem.png',
            },
            chatId: 'chat1',
            createdAt: new Date().toISOString(),
        },
        {
            _id: 'p2',
            title: 'Мобильное приложение для учёта финансов',
            description: 'Проект на React Native + Firebase. Нужен ещё один разработчик. Уже есть базовая структура, нужна помощь с функционалом.',
            theme: 'Айти',
            tags: ['React Native', 'Firebase', 'Мобильная разработка'],
            owner: {
            _id: 'u2',
            name: 'Мария',
            avatar: '/avatars/maria.png',
            },
            chatId: 'chat2',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: 'p3',
            title: 'Образовательная платформа',
            description: 'Создаём сервис с курсами и тестами. Стек: Next.js, NestJS. Нужны разработчики для фронтенда и бекенда.',
            theme: 'Учёба',
            tags: ['Next.js', 'NestJS', 'Образование', 'Fullstack'],
            owner: {
            _id: 'u3',
            name: 'Илья',
            avatar: '/avatars/ilya.png',
            },
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: 'p4',
            title: 'CRM для малого бизнеса',
            description: 'Автоматизация работы с клиентами. Нужен дизайнер и менеджер. Проект на стадии планирования.',
            theme: 'Бизнес',
            tags: ['CRM', 'Бизнес', 'Автоматизация'],
            owner: {
            _id: 'u4',
            name: 'Екатерина',
            },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: 'p5',
            title: 'Маркетплейс услуг',
            description: 'Ищем команду для запуска MVP. Уже есть бекенд на Node.js. Нужны фронтенд-разработчики и дизайнеры.',
            theme: 'Бизнес',
            tags: ['Node.js', 'MVP', 'Маркетплейс', 'Стартап'],
            owner: {
            _id: 'u5',
            name: 'Даниил',
            },
            chatId: 'chat5',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        ]
}))