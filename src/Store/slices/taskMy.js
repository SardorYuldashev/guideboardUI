import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  URL: "/user-guides",
  limit: 10,
  offset: 0,
  filters: {
    completed: false,
  },
};

const taskMySlice = createSlice({
  name: "taskMy",
  initialState,
  reducers: {
    loadURL(state, { payload }) {
      state.URL = payload;
    },
    loadLimit(state, { payload }) {
      state.limit = payload;
    },
    loadOffset(state, { payload }) {
      state.offset = payload;
    },
    loadFilters(state, { payload }) {
      state.filters.completed = payload;
    },
  },
});

export const { loadURL, loadLimit, loadOffset, loadFilters } = taskMySlice.actions;

const taskMyReducer = taskMySlice.reducer;

export default taskMyReducer;