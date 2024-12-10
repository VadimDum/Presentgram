import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import chatReducer from './chatws/chatSlice';
import postReducer from './wall/postsSlice'
import groupReducer from './group/groupSlice'

import userReducer from './users/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    post: postReducer,
    users: userReducer,
    groups: groupReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
