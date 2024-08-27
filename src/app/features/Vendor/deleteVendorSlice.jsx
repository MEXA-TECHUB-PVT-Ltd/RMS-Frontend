import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const deleteVendor = createAsyncThunk(
  "vendor/deleteVendor",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/vendor/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  message: "",
  success: false,
};

const deleteVendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        (state.isLoading = false), (state.error = null);
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        (state.isLoading = false), (state.error = action.payload);
        state.message =
          action.payload.message || action.payload?.error?.message;
        state.success = action.payload.success;
      });
  },
});

export default deleteVendorSlice.reducer;
