import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getPaymentTerms = createAsyncThunk(
  "payment-term",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/payment-term`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  payment_terms: [],
  message: "",
  success: false,
};

const getPaymentTermSlice = createSlice({
  name: "payment_term",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentTerms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPaymentTerms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.payment_terms = action.payload.result;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getPaymentTerms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.payment_terms = [];
        state.message = action.payload.message || action.payload.error.message;
        state.success = action.payload.success;
      });
  },
});

export default getPaymentTermSlice.reducer;
