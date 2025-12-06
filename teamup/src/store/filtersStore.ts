import { create } from 'zustand';

export type ThemeType = 'Айти' | 'Учёба' | 'Наука' | 'Творчество' | 'Бизнес' | null;

export type RoleType = 'Разработчик' | 'Дизайнер' | 'Менеджер' | null;

interface FiltersStore {
  search: string;
  theme: ThemeType;
  tags: string[];
  role: RoleType;
  
  // Actions
  setSearch: (search: string) => void;
  setTheme: (theme: ThemeType) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setRole: (role: RoleType) => void;
  resetFilters: () => void;
}

const initialState = {
  search: '',
  theme: null as ThemeType,
  tags: [],
  role: null as RoleType,
};

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  ...initialState,
  
  setSearch: (search) => {
    set({ search });
  },
  
  setTheme: (theme) => {
    set({ theme, tags: [] }); // Сбрасываем теги при смене тематики
  },
  
  setTags: (tags) => {
    set({ tags });
  },
  
  addTag: (tag) => {
    const { tags } = get();
    if (!tags.includes(tag)) {
      set({ tags: [...tags, tag] });
    }
  },
  
  removeTag: (tag) => {
    const { tags } = get();
    set({ tags: tags.filter(t => t !== tag) });
  },
  
  setRole: (role) => {
    set({ role });
  },
  
  resetFilters: () => {
    set(initialState);
  },
}));
