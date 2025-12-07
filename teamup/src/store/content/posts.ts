import { Post } from '@/types/posts';
import { create } from 'zustand';

interface PostsStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export const usePostsStore = create<PostsStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
}));

