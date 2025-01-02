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
  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  },
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/signin", formData);
      set({ authUser: response.data });
      toast.success("¡Inicio de sesión exitoso!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error durante el inicio de sesión.";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        formData
      );
      set({ authUser: response.data });
      toast.success("¡Perfil actualizado!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error durante la actualización del perfil.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
