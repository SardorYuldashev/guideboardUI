import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reRender: false,
};

const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    loadRefreshData(state, { payload }) {
      state.reRender = payload;
    },
  },
});

export const { loadRefreshData } = refreshSlice.actions;

const refreshReducer = refreshSlice.reducer;

export default refreshReducer;