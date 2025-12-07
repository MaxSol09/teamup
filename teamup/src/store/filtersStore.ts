import { create } from 'zustand';

export type ThemeType = 'Айти' | 'Учёба' | 'Наука' | 'Творчество' | 'Бизнес' | null;

export type RoleType = 'Разработчик' | 'Дизайнер' | 'Менеджер' | null;

export type IsActiveType = boolean | null; // null = все, true = активные, false = неактивные

interface FiltersStore {
  search: string;
  theme: ThemeType;
  tags: string[];
  role: RoleType;
  isActive: IsActiveType;
  
  // Actions
  setSearch: (search: string) => void;
  setTheme: (theme: ThemeType) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setRole: (role: RoleType) => void;
  setIsActive: (isActive: IsActiveType) => void;
  resetFilters: () => void;
}

const initialState = {
  search: '',
  theme: null as ThemeType,
  tags: [],
  role: null as RoleType,
  isActive: null as IsActiveType,
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
  
  setIsActive: (isActive) => {
    set({ isActive });
  },
  
  resetFilters: () => {
    set(initialState);
  },
}));

