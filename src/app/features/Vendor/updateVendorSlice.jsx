import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const updateVendor = createAsyncThunk(
  "vendors/update",
  async ({ id, vendorData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/vendor/${id}`, vendorData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  success: false,
  message: null,
};

const updateVendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = action.payload.message || action.payload.error.message;
        state.success = action.payload.success;
      });
  },
});

export default updateVendorSlice.reducer;
