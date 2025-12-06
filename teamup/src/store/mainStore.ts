import { create } from 'zustand';

type TabType = 'posts' | 'projects' | 'communities';

interface MainStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  activeTab: 'posts',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));


