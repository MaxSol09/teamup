export interface Community {
  _id: string;
  title: string;
  description: string;
  theme: string;
  tags: string[];

  isPublic: boolean;

  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };

  createdAt: string;
  updatedAt: string;
  
  membersCount?: number;
}