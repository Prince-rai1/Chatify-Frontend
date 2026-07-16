import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  contacts: [],
  selectedChat: null,
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setContacts: (state, action) => {
      state.contacts = action.payload;
    },

    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    markChatSeen: (state, action) => {
      const chatUserId = action.payload;

      state.messages.forEach((message) => {
        if (message.receiver === chatUserId && !message.isSeen) {
          message.isSeen = true;
        }
      });
    },

    updateChat: (state, action) => {
      const { newMessage, currentUserId, selectedChatId } = action.payload;

      // Partner kaun hai?
      const partnerId =
        newMessage.sender === currentUserId
          ? newMessage.receiver
          : newMessage.sender;

      // Chat find karo
      const index = state.chats.findIndex((chat) => chat._id === partnerId);

      if (index === -1) return;

      // Chat copy nikalo
      const chat = state.chats[index];

      // Latest Message
      chat.lastMessage =
        newMessage.message || (newMessage.images?.length ? "📷 Photo" : "");


      chat.lastImages = newMessage.images;
      
      // Latest Time
      chat.lastMessageTime = newMessage.createdAt;

      // Unread Count
      if (newMessage.sender !== currentUserId && selectedChatId !== partnerId) {
        chat.unreadCount += 1;
      }

      // Move Top
      state.chats.splice(index, 1);

      state.chats.unshift(chat);
    },

    clearChat: (state) => {
      state.chats = [];
      state.contacts = [];
      state.selectedChat = null;
      state.messages = [];
    },
    replaceMessage: (state, action) => {
      const { tempId, realMessage } = action.payload;
      const index = state.messages.findIndex((msg) => msg._id === tempId);
      if (index !== -1) {
        state.messages[index] = realMessage; // temp ko asli data se replace
      }
    },
    resetUnreadCount: (state, action) => {
      const chat = state.chats.find((chat) => chat._id === action.payload);

      if (chat) {
        chat.unreadCount = 0;
      }
    },

    setLoadingChats: (state, action) => {
      state.isLoadingChats = action.payload;
    },

    setLoadingMessages: (state, action) => {
      state.isLoadingMessages = action.payload;
    },
  },
});

export const {
  setChats,
  setContacts,
  setSelectedChat,
  setMessages,
  addMessage,
  clearChat,
  setLoadingChats,
  setLoadingMessages,
  replaceMessage,
  markChatSeen,
  updateChat,
  resetUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
