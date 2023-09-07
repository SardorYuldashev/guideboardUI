import { configureStore } from '@reduxjs/toolkit';
import refreshReducer from './slices/refresh';
import taskAllReducer from './slices/taskAll';
import taskMyReducer from './slices/taskMy';
import guidesReducer from './slices/guides';
import usersReducer from './slices/users';

const store = configureStore({
  reducer: {
    refresh: refreshReducer,
    taskAll: taskAllReducer,
    taskMy: taskMyReducer,
    guides: guidesReducer,
    users: usersReducer,
  },
});

export default store;