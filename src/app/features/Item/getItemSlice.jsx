import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getItems = createAsyncThunk(
    "item/getItems", // Ensure this matches your slice name and action
    async ({ currentPage = 1, perPage = 10, search = '', product_catalog, product_category, type }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/item/get/list`, {
                params: { currentPage, perPage, name: search, product_catalog, product_category, type },
            });
            console.log("data", data)
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const getItemDetails = createAsyncThunk(
    "item/getItem",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/item/specific?id=${id}`);
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
    itemdetails: null,
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

const getItemSlice = createSlice({
    name: "item", // Ensure this matches your slice name
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        builder
            .addCase(getItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.items = action.payload.result.items;
                state.pagination = {
                    totalItems: action.payload.result.count,
                    totalPages: Math.ceil(action.payload.result.count / state.pagination.limit),
                    currentPage: action.meta.arg.currentPage,
                    limit: action.meta.arg.perPage,
                };
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.items = [];
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            })

            .addCase(getItemDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getItemDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.itemdetails = action.payload.result; // Use itemDetails state
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getItemDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.itemdetails = null;
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            });

    },
});

export default getItemSlice.reducer;
