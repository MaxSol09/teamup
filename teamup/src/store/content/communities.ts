import { Community } from '@/types/communities';
import { create } from 'zustand';

interface CommunityStore {
  communities: Community[];
  setCommunities: (communities: Community[]) => void;
}

export const useCommunitiesStore = create<CommunityStore>((set) => ({
  communities: [],
  setCommunities: (communities) => set({ communities }),
}));


