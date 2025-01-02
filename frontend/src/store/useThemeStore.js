import { create } from "zustand";
import toast from "react-hot-toast";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
    toast.success("Tema cambiado correctamente.");
  },
}));
