import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDataType } from '../../../schemas/authSchema';
import { MessageT } from '../../../schemas/messageSchema';
import { groupDataType } from './chatwsContext';

export type ChatSliceT = {
  users: UserDataType[];
  messages: MessageT[];
  draw: string;
  groups: groupDataType[]

};

const initialState: ChatSliceT = {
  users: [],
  messages: [],
  draw: '',
  groups: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserDataType[]>) => {
      state.users = action.payload;
    },
    addMessage: (state, action: PayloadAction<MessageT>) => {
      state.messages.push(action.payload);
    },
    editMessage: (state, action) => {
      const { messageId, text } = action.payload;
      state.messages = state.messages.map((message) =>
        message.id === messageId ? { ...message, text } : message,
      );
    },
    setMessages: (state, action: PayloadAction<MessageT[]>) => {
      state.messages = action.payload;
    },
    setDraw: (state, action) => {
      state.draw = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
  },
});

export const { setUsers, addMessage, editMessage, setDraw, addGroup } = chatSlice.actions;

export default chatSlice.reducer;
