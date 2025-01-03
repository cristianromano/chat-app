import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error getting messages:", error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data });
    } catch (error) {
      console.error("Error getting users:", error.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/message/${selectedUser._id}`,
        formData
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
