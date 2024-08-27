import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk(
  "vendors/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/users/login`, payload);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "theme",
  initialState: {
    token: null,
    user: null,
    isLoading: false,
    error: null,
    success: false,
    message: null,
  },

  reducers: {
    logOutUser: (state) => {
      state.token = null;
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.result;
        state.token = action.payload.result.authToken;
        state.isLoading = false;
        state.error = null;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = action.payload.success;
        state.user = null;
        state.token = null;
        state.message = action.payload.message || action.payload.error.message;
      });
  },
});

export const { logOutUser } = userSlice.actions;

export default userSlice.reducer;
