import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  URL: "/users",
  limit: 10,
  offset: 0,
  search: "",
  sortBy: "id",
  sortOrder: "asc",
  userRole: "all",
};

const usersSlice = createSlice({
  name: "users",
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
    loadSortBy(state, { payload }) {
      state.sortBy = payload;
    },
    loadSortOrder(state, { payload }) {
      state.sortOrder = payload;
    },
    loadRole(state, { payload }) {
      state.userRole = payload;
    },
  },
});

export const { loadURL, loadLimit, loadOffset, loadSearch, loadSortBy, loadSortOrder, loadRole } = usersSlice.actions;

const usersReducer = usersSlice.reducer;

export default usersReducer;