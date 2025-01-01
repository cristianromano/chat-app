import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      // Make the GET request with `withCredentials`
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      console.error("Error checking auth:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: response.data });
      toast.success("¡Registro exitoso!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error durante el registro.";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
