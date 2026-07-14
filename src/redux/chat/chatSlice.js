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
  markChatSeen
} = chatSlice.actions;

export default chatSlice.reducer;
