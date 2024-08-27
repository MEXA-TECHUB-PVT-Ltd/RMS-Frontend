import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getPRs = createAsyncThunk(
    "pr/getPRs", // Ensure this matches your slice name and action
    async ({ page = 1, limit = 10  }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/purchase-requisition`, {
                params: { page, limit},
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
            const { data } = await axios.get(`${API_URL}/purchase-requisition/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    isLoading: false,
    error: null,
    PRs: [],
    prdetail: null,
    vendor: null,
    pagination: {
        totalItems: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
    },
    message: null,
    success: false,
};

const getPRSlice = createSlice({
    name: "pr", // Ensure this matches your slice name
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        builder
            .addCase(getPRs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPRs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.pr = action.payload.result.p_requisitions;
                state.pagination = {
                    totalItems: action.payload.result.count,
                    totalPages: Math.ceil(action.payload.result.count / state.pagination.limit),
                    page: action.meta.arg.page,
                    limit: action.meta.arg.limit,
                };
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getPRs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.pr = [];
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            })
            
            .addCase(getPRDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getPRDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.prdetail = action.payload.result; // Use prdetail state
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getPRDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.prdetail = null;
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            });

    },
});

export default getPRSlice.reducer;
