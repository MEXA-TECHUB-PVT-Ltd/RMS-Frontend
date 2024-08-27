import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addVendor = createAsyncThunk(
  "vendors/create",
  async (vendorData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/vendor/create`, vendorData);
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

const addVendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = action.payload.message || action.payload.error.message;
        state.success = action.payload.success;
      });
  },
});

export default addVendorSlice.reducer;
