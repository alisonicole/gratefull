import { create } from "zustand";

export const useUIStore = create((set) => ({
  toast: null,
  modal: null,
  isLoading: false,
  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },
  openModal:  (id, props = {}) => set({ modal: { id, props } }),
  closeModal: () => set({ modal: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));