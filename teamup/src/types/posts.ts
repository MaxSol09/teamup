export interface PostResponse {
  _id: string;
  postId: string;

  user: {
    _id: string;
    name: string;
    avatar?: string;
  };

  message?: string;        // Комментарий к отклику
  status: 'pending' | 'accepted' | 'rejected';

  createdAt: string;
}

export type Theme = | 'IT' | 'Наука' | 'Учёба' | 'Бизнес' | 'Творчество';

export interface Post {
  _id: string;
  title: string;
  description: string;
  theme: string; // Например: "Айти", "Учёба", "Наука"
  tags: string[];
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  isActive: boolean;
}