import { Post } from '@/types/posts';
import { create } from 'zustand';


interface PostsStore {
    posts: Post[]
}

export const usePostsStore = create<PostsStore>((set) => ({
    posts: [
  {
    _id: 'post-1',
    title: 'Ищу фронтенд-разработчика',
    description: 'Нужен React/Next.js разработчик для стартапа. Требуется опыт работы с TypeScript, Next.js и современными инструментами разработки. Готовы предложить интересные задачи и возможность работать над реальным продуктом.',
    theme: 'Айти',
    tags: ['React', 'Next.js', 'TypeScript', 'Frontend'],
    owner: {
      _id: 'user-1',
      name: 'Андрей',
      avatar: '',
    },
    createdAt: new Date().toISOString(),
    isActive: true,
  },

  {
    _id: 'post-2',
    title: 'Ищу UX/UI дизайнера',
    description: 'Делаем мобильное приложение. Нужен опытный дизайнер для создания интерфейсов и пользовательского опыта. Работа в команде, возможность влиять на продукт.',
    theme: 'Творчество',
    tags: ['UI/UX', 'Дизайн', 'Мобильные приложения'],
    owner: {
      _id: 'user-3',
      name: 'Мария',
      avatar: '',
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
]
}))

