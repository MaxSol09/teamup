import { create } from 'zustand';

type TabType = 'posts' | 'projects' | 'communities' | 'events';
type ModalType = 'ad' | 'project' | 'community' | null;

interface MainStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openModal: ModalType;
  setOpenModal: (modal: ModalType) => void;
  openAdModal: () => void;
  openProjectModal: () => void;
  openCommunityModal: () => void;
  closeModal: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  activeTab: 'posts',
  setActiveTab: (tab) => set({ activeTab: tab }),
  openModal: null,
  setOpenModal: (modal) => set({ openModal: modal }),
  openAdModal: () => set({ openModal: 'ad' }),
  openProjectModal: () => set({ openModal: 'project' }),
  openCommunityModal: () => set({ openModal: 'community' }),
  closeModal: () => set({ openModal: null }),
}));


