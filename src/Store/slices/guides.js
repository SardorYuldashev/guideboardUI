import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  URL: "/guides",
  limit: 10,
  offset: 0,
  search: "",
  sort: {
    order: "asc",
  },
};

const guidesSlice = createSlice({
  name: "guides",
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
    loadSearch(state, { payload }) {
      state.search = payload;
    },
    loadSort(state, { payload }) {
      state.sort.order = payload;
    },
  },
});

export const { loadURL, loadLimit, loadOffset, loadSearch, loadSort } = guidesSlice.actions;

const guidesReducer = guidesSlice.reducer;

export default guidesReducer;