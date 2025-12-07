import { create } from "zustand";
import { User, UserRole } from "@/types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  showProfileModal: boolean;

  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  setObserverMode: () => void;
  isObserver: () => boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  showProfileModal: false,

  setAuth: (token, user) => set({ token, user }),
  setUser: (user) => set({ user }),

  // Устанавливает режим наблюдателя
  setObserverMode: () => {
    const currentUser = get().user;
    if (currentUser) {
      set({ 
        user: { ...currentUser, role: 'observer' },
        showProfileModal: false 
      });
    }
  },

  // Проверяет, является ли пользователь наблюдателем
  isObserver: () => {
    const user = get().user;
    return user?.role === 'observer';
  },

  openProfileModal: () => set({ showProfileModal: true }),
  closeProfileModal: () => set({ showProfileModal: false }),

  logout: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      showProfileModal: false,
    });
  },
}));