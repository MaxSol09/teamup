import { Project } from "@/types/project";
import { create } from "zustand";

interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}));