import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserData } from "../../services/api";

export const loadUserData = createAsyncThunk(
  "user/loadUserData",
  async (token, { rejectWithValue }) => {
    try {
      const data = await getUserData(token);
      console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user_data: null,
  status: "idle",
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user_data = action.payload;
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const {} = userSlice.actions;

export default userSlice.reducer;

export const selectUserOrders = (state) => state.user.user_data?.orders;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
