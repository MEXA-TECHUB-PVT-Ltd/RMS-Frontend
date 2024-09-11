import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getInvoices = createAsyncThunk(
    "invoice/getInvoices", // Ensure this matches your slice name and action
    async ({ currentPage = 1, perPage = 10, search = '' }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/invoice/get/list`, {
                params: { currentPage, perPage, name: search },
            });
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const getInvoiceDetails = createAsyncThunk(
    "invoice/getInvoice",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/invoice/get/specific?id=${id}`); 
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
    invoicedetails: null,
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

const getInvoiceSlice = createSlice({
    name: "invoice", // Ensure this matches your slice name
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        builder
            .addCase(getInvoices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getInvoices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.invoice = action.payload.result.items;
                state.pagination = {
                    totalItems: action.payload.result.count,
                    totalPages: Math.ceil(action.payload.result.count / state.pagination.limit),
                    currentPage: action.meta.arg.currentPage,
                    limit: action.meta.arg.perPage,
                };
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getInvoices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.invoice = [];
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            })

            .addCase(getInvoiceDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getInvoiceDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.invoicedetails = action.payload.result; // Use invoicedetails state
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getInvoiceDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.invoicedetails = null;
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            });

    },
});

export default getInvoiceSlice.reducer;
