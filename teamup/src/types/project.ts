export interface Project {
  _id: string;
  title: string;
  description: string;
  theme: string;
  tags: string[];
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  chatId?: string; // Только личный чат с владельцем
  createdAt: string;
}