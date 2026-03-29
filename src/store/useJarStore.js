import { create } from "zustand";

export const useJarStore = create((set) => ({
  jars: [],
  activeJar: null,
  setJars: (jars) => set({ jars, activeJar: jars.find(j => j.get("isDefault")) ?? jars[0] ?? null }),
  setActiveJar: (jar) => set({ activeJar: jar }),
  incrementEntryCount: () => set((s) => {
    if (!s.activeJar) return {};
    s.activeJar.set("entryCount", (s.activeJar.get("entryCount") || 0) + 1);
    return { activeJar: s.activeJar };
  }),
}));