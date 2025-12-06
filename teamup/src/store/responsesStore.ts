/**
 * Zustand store для управления состоянием откликов
 * Централизованное управление данными и бизнес-логикой
 */

import { create } from 'zustand';
import { OwnerResponsesDTO, Response, RecommendedUser, ResponseStatus } from '@/types/responses';
import * as responsesAPI from '@/api/responses';

type TabType = 'applicants' | 'recommended';

interface ResponsesStore {
  // Главная страница /responses
  myItems: Array<{
    _id: string;
    type: 'post' | 'project' | 'community';
    title: string;
    theme: string;
    tags: string[];
    totalResponses: number;
    newResponses: number;
    createdAt: string;
  }>;
  myItemsLoading: boolean;
  myItemsError: string | null;
  
  // Страница деталей /responses/:type/:id
  ownerData: OwnerResponsesDTO | null;
  ownerDataLoading: boolean;
  ownerDataError: string | null;
  
  // Вкладки на странице деталей
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Локальные фильтры для откликов (только UI)
  statusFilter: ResponseStatus | 'all';
  setStatusFilter: (status: ResponseStatus | 'all') => void;
  
  // Actions
  fetchMyItems: () => Promise<void>;
  fetchOwnerResponses: (type: string, id: string) => Promise<void>;
  acceptResponse: (responseId: string) => Promise<void>;
  rejectResponse: (responseId: string) => Promise<void>;
  resetStore: () => void;
}

const initialState = {
  myItems: [],
  myItemsLoading: false,
  myItemsError: null,
  ownerData: null,
  ownerDataLoading: false,
  ownerDataError: null,
  activeTab: 'applicants' as TabType,
  statusFilter: 'all' as ResponseStatus | 'all',
};

export const useResponsesStore = create<ResponsesStore>((set, get) => ({
  ...initialState,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  fetchMyItems: async () => {
    set({ myItemsLoading: true, myItemsError: null });
    try {
      const items = await responsesAPI.fetchMyItems();
      set({ myItems: items, myItemsLoading: false });
    } catch (error) {
      set({
        myItemsError: error instanceof Error ? error.message : 'Ошибка загрузки',
        myItemsLoading: false,
      });
    }
  },
  
  fetchOwnerResponses: async (type: string, id: string) => {
    set({ ownerDataLoading: true, ownerDataError: null });
    try {
      const data = await responsesAPI.fetchOwnerResponses(type, id);
      set({ ownerData: data, ownerDataLoading: false });
    } catch (error) {
      set({
        ownerDataError: error instanceof Error ? error.message : 'Ошибка загрузки',
        ownerDataLoading: false,
      });
    }
  },
  
  acceptResponse: async (responseId: string) => {
    try {
      const { chatId } = await responsesAPI.acceptResponse(responseId);
      
      // Обновляем статус отклика в локальном состоянии
      set((state) => {
        if (!state.ownerData) return state;
        
        return {
          ownerData: {
            ...state.ownerData,
            responses: state.ownerData.responses.map((resp) =>
              resp._id === responseId
                ? { ...resp, status: 'accepted' as const, chatId }
                : resp
            ),
          },
        };
      });
    } catch (error) {
      throw error;
    }
  },
  
  rejectResponse: async (responseId: string) => {
    try {
      await responsesAPI.rejectResponse(responseId);
      
      // Обновляем статус отклика в локальном состоянии
      set((state) => {
        if (!state.ownerData) return state;
        
        return {
          ownerData: {
            ...state.ownerData,
            responses: state.ownerData.responses.map((resp) =>
              resp._id === responseId
                ? { ...resp, status: 'rejected' as const }
                : resp
            ),
          },
        };
      });
    } catch (error) {
      throw error;
    }
  },
  
  resetStore: () => {
    set(initialState);
  },
}));
