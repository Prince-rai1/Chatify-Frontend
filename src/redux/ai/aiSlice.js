import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  characters: [],
  selectedCharacter: null,
  aiMessages: [],
  isLoadingCharacters: false,
  isLoadingMessages: false,
  isStreaming: false,
  streamingText: "",
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setCharacters: (state, action) => {
      state.characters = action.payload;
    },

    setSelectedCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    },

    setAiMessages: (state, action) => {
      state.aiMessages = action.payload;
    },

    addAiMessage: (state, action) => {
      state.aiMessages.push(action.payload);
    },

    setLoadingCharacters: (state, action) => {
      state.isLoadingCharacters = action.payload;
    },

    setLoadingAiMessages: (state, action) => {
      state.isLoadingMessages = action.payload;
    },

    setStreaming: (state, action) => {
      state.isStreaming = action.payload;
    },

    appendStreamChunk: (state, action) => {
      state.streamingText += action.payload;
    },

    clearStreamingText: (state) => {
      state.streamingText = "";
    },

    clearAiChat: (state) => {
      state.aiMessages = [];
      state.streamingText = "";
      state.isStreaming = false;
    },
  },
});

export const {
  setCharacters,
  setSelectedCharacter,
  setAiMessages,
  addAiMessage,
  setLoadingCharacters,
  setLoadingAiMessages,
  setStreaming,
  appendStreamChunk,
  clearStreamingText,
  clearAiChat,
} = aiSlice.actions;

export default aiSlice.reducer;
