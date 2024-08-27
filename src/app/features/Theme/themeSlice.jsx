import { createSlice } from "@reduxjs/toolkit";

const initialMode = "light";
const bgColor = "yellow-500";
const textColor = "yellow-500";
const borderColor = "yellow-500";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialMode,
    bgColor: `bg-${bgColor}`,
    textColor: `text-${textColor}`,
    borderColor: `border-${borderColor}`,
    isSideBarOpen: true,
  },

  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setThemeColor: (state, action) => {
      state.bgColor = `bg-${action.payload}`;
      state.textColor = `text-${action.payload}`;
      state.borderColor = `border-${action.payload}`;
    },

    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
  },
});

export const { toggleTheme, setThemeColor, toggleSideBar } = themeSlice.actions;

export default themeSlice.reducer;
