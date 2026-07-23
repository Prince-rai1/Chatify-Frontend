import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice'
import chatReducer from '../chat/chatSlice'
import aiReducer from '../ai/aiSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ai: aiReducer,
  },
});

export default store;
