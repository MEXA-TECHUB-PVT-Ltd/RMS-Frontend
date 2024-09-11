import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getRecipes = createAsyncThunk(
    "recipe/getRecipes", // Ensure this matches your slice name and action
    async ({ currentPage = 1, perPage = 10, search = '' }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/recipe/list`, {
                params: { currentPage, perPage, name: search },
            }); 
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const getRecipeDetails = createAsyncThunk(
    "recipe/getRecipe",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/recipe/specific?id=${id}`);
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
    recipedetails: null,
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

const getRecipeSlice = createSlice({
    name: "recipe", // Ensure this matches your slice name
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        builder
            .addCase(getRecipes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRecipes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.recipe = action.payload.result.recipes;
                state.pagination = {
                    totalItems: action.payload.result.count,
                    totalPages: Math.ceil(action.payload.result.count / state.pagination.limit),
                    currentPage: action.meta.arg.currentPage,
                    limit: action.meta.arg.perPage,
                };
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getRecipes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.recipe = [];
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            })

            .addCase(getRecipeDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getRecipeDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.recipedetails = action.payload.result; // Use recipedetails state
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(getRecipeDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.recipedetails = null;
                state.message = action.payload.message || action.payload.error.message;
                state.success = action.payload.success;
            });

    },
});

export default getRecipeSlice.reducer;
