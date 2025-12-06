

import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: any | null;
  showProfileModal: boolean;

  setAuth: (token: string, user: any) => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  showProfileModal: false,

  setAuth: (token, user) => set({ token, user }),

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