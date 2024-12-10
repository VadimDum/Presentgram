import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserStatusEnum, type AuthType } from '../../../schemas/authSchema';
import { checkAuthThunk, loginThunk, logoutThunk, signupThunk } from './authThunks';

const initialState: AuthType = {
  accessToken: '',
  user: { 
    status: UserStatusEnum.pending,
    id: null,
    name: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      console.log('Токен установлен в store:', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log('Токен из loginThunk:', action.payload.accessToken);
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        console.log('Токен из signupThunk:', action.payload.accessToken);
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(checkAuthThunk.fulfilled, (_, action) => 
        action.payload)
      .addCase(checkAuthThunk.rejected, (state) => {
        state.user.status = UserStatusEnum.guest;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = '';
        state.user = { status: UserStatusEnum.guest, id: null, name: '' };
        console.log(state.user);
      });
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
