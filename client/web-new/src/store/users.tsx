import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: number;
}

interface UserStore {
  user: UserInfo | null;
  isLogged: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

export const useUsers = create<UserStore>()(
  immer((set) => ({
    user: null,
    isLogged: false,
    setUser: (user) => {
      set((state) => {
        state.user = user;
        state.isLogged = true;
      });
    },
    clearUser: () => {
      set((state) => {
        state.user = null;
        state.isLogged = false;
      });
    },
  }))
);
