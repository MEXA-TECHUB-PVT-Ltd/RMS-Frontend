import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getPR = createAsyncThunk(
    "po/getPR", // Ensure this matches your slice name and action
    async ({ currentPage = 1, perPage = 10, search = '' }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/purchase/receives/get/all`, {
                params: { currentPage, perPage, purchase_received_number: search },
            });
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const getPRDetails = createAsyncThunk(
    "pr/getpr",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/purchase/receives/specific/get?id=${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    isLoading: false,
    error: null,
    items: [],
    podetail: null,
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

const getPRsSlice = createSlice({
    name: "purchase_receives", // Ensure this matches your slice name
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        builder
            .addCase(getPR.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPR.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.purchase_receives = action.payload.result.purchase_receives;
                state.pagination = {
                    totalItems: action.payload.result.count,
                    totalPages: Math.ceil(action.payload.result.count / state.pagination.limit),
                    currentPage: action.meta.arg.currentPage,
                    limit: action.meta.arg.perPage,
                };
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getPR.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.purchase_receives = [];
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            })

            .addCase(getPRDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getPRDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.purchase_receives = action.payload.result; // Use podetail state
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getPRDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.purchase_receives = null;
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            });

    },
});

export default getPRsSlice.reducer;
