import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  URL: "/user-guides/all",
  limit: 10,
  offset: 0,
  filters: {
    completed: "all",
  },
};

const taskAllSlice = createSlice({
  name: "taskAll",
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

export const { loadURL, loadLimit, loadOffset, loadFilters } = taskAllSlice.actions;

const taskAllReducer = taskAllSlice.reducer;

export default taskAllReducer;