

import { Community } from '@/types/communities';
import { create } from 'zustand';

interface CommunityStore {
    communities: Community[]
}

export const useCommunitiesStore = create<CommunityStore>((set) => ({
    communities: [
        {
            _id: 'c1',
            title: 'React разработчики',
            description: 'Сообщество для обмена опытом, обсуждения новостей и поиска единомышленников в области React разработки.',
            theme: 'Айти',
            tags: ['React', 'JavaScript', 'Frontend', 'Разработка'],
            owner: {
                _id: 'u1',
                name: 'Артём',
                avatar: '/avatars/artem.png',
            },
            isPublic: true,
            membersCount: 127,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: 'c2',
            title: 'Научные исследования',
            description: 'Закрытое сообщество для учёных и исследователей. Обмен результатами, обсуждение методологий и совместные проекты.',
            theme: 'Наука',
            tags: ['Наука', 'Исследования', 'Академия'],
            owner: {
                _id: 'u2',
                name: 'Мария',
                avatar: '/avatars/maria.png',
            },
            isPublic: false,
            membersCount: 45,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: 'c3',
            title: 'Студенты IT',
            description: 'Сообщество для студентов, изучающих программирование. Помощь с учёбой, обмен материалами и совместная подготовка.',
            theme: 'Учёба',
            tags: ['Студенты', 'Обучение', 'IT', 'Программирование'],
            owner: {
                _id: 'u3',
                name: 'Илья',
            },
            isPublic: true,
            membersCount: 89,
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ]
}))


