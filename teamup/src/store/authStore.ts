
import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  showProfileModal: boolean;

  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  showProfileModal: false,

  setAuth: (token, user) => set({ token, user }),
  setUser: (user) => set({ user }),

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