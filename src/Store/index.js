import { configureStore } from '@reduxjs/toolkit';
import refreshReducer from './slices/refresh';

const store = configureStore({
  reducer: {
    refresh: refreshReducer,
  }
});

export default store;