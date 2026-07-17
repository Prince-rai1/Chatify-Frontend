import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  isCheckingAuth: true,
  onlineUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isCheckingAuth = false;
    },

    logout: (state, action) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isCheckingAuth = false;
      state.onlineUsers = [];
    },

    updateuser: (state, action) => {
      state.user = action.payload;
    },

    setonlineusers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updateFullName: (state, action) => {
      state.user.fullname = action.payload;
    },

    updateUserName: (state, action) => {
      state.user.username = action.payload;
    },
  },
});

export const { login, logout, updateuser, setonlineusers, updateFullName, updateUserName } = authSlice.actions;
export default authSlice.reducer;
