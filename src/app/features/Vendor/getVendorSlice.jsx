import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getVendors = createAsyncThunk(
  "vendor/getVendors",
  async (
    { page = 1, limit = 10, payment_term_name, provider_type, search_company_name, search_vendor_display_name, v_type },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(`${API_URL}/vendor`, {
        params: { page, limit, payment_term_name, provider_type, search_company_name, search_vendor_display_name, v_type },
      });
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getVendorDetails = createAsyncThunk(
  "vendor/getVendor",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/vendor/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  vendors: [],
  vendor: null,
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
  message: null,
  success: false,
};

const getVendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVendors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.vendors = action.payload.result.vendors;
        state.pagination = {
          totalItems: action.payload.result.pagination.totalItems,
          totalPages: action.payload.result.pagination.totalPages,
          currentPage: action.payload.result.pagination.currentPage,
          limit: action.payload.result.pagination.limit,
        };
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.vendors = [];
        state.message = action.payload.message || action.payload.error.message;
        state.success = action.payload.success;
      })
      .addCase(getVendorDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.vendor = action.payload.result;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getVendorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.vendor = null;
        state.message = action.payload.message || action.payload.error.message;
        state.success = action.payload.success;
      });
  },
});

export default getVendorSlice.reducer;
