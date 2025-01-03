import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

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

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    set({ messages: [] });
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
