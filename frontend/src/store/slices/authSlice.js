import { createSlice } from "@reduxjs/toolkit";
import { loadAuthState } from "../../services/authPersist";

const initialState = loadAuthState()?.auth || {
  user: null,
  token: null,
  status: "idle",
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserData: (state, action) => {
      if (state.user) {
        state.user.user_data = action.payload;
      }
    },
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          user_data: action.payload
        };
      }
    }
  }
});

export const {
  setCredentials,
  logout,
  setError,
  clearError,
  setUserData,
  updateUserData
} = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
