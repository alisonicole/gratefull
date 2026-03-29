import { create } from "zustand";
import Parse from "@/lib/parse";

export const useAuthStore = create((set) => ({
  user: null,
  isPro: false,
  loading: true,
  rehydrate: async () => {
    try {
      const current = await Parse.User.currentAsync();
      set({ user: current ?? null, isPro: current?.get("subscriptionStatus") === "pro", loading: false });
    } catch {
      set({ user: null, isPro: false, loading: false });
    }
  },
  setUser: (user) => set({ user, isPro: user?.get("subscriptionStatus") === "pro" }),
  logout: async () => { await Parse.User.logOut(); set({ user: null, isPro: false }); },
}));