import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });

      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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
      get().connectSocket();
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
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return; // Ya existe una conexión activa
    }
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();

    console.log(socket);
    set({ socket: socket });

    socket.on("user-connected", (users) => {
      set({ onlineUsers: users });
    });

    // socket.on("user-disconnected", (users) => {
    //   set({ onlineUsers: users });
    // });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
