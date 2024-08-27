import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCurrencies = createAsyncThunk(
  "currency",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/currency`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  currencies: [],
  message: "",
  success: false,
};

const getCurrencySlice = createSlice({
  name: "payment_term",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrencies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currencies = action.payload.result;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getCurrencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currencies = [];
        state.message = action.payload.message || action.payload.error.message;
        state.success = action.payload.success;
      });
  },
});

export default getCurrencySlice.reducer;
