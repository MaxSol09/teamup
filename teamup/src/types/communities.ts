export interface Community {
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
  isPublic: boolean; // Только у сообществ
  membersCount: number;
  createdAt: string;
}