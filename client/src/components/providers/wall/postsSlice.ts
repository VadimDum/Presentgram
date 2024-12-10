import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadWallPostsThunk, WallPostsState, WallPostsT } from "./postsThunk";
import axiosInstance from "../../../services/axiosInstance";

const initialState: WallPostsState = {
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {

    addPost: (state, action: PayloadAction<WallPostsT>) => {
      const newPost: WallPostsT = {
        id: Math.round(Math.random() * 1e9),
        userid: action.payload.userid,
        wallreaction: action.payload.wallreaction,
        wallreactionimg: null,
        authorid: action.payload.authorid,
        Userwallauthor: action.payload.Userwallauthor,
        Userwallprofile: { userid: action.payload.userid },
      };
      state.posts?.unshift(newPost);
      axiosInstance.post('/wallelements', newPost);
    },
    addImagePost: (state, action: PayloadAction<WallPostsT>) => {
      const newPost: WallPostsT = {
        id: Math.round(Math.random() * 1e9),
        userid: action.payload.userid,
        wallreaction: action.payload.wallreaction,
        wallreactionimg: null,
        wallreactionimgcurrent: action.payload.wallreactionimgcurrent,
        authorid: action.payload.authorid,
        Userwallauthor: action.payload.Userwallauthor,
        Userwallprofile: { userid: action.payload.userid },
      };
      state.posts?.unshift(newPost);
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts?.filter((post) => post.id !== action.payload);
      axiosInstance.delete(`/wallelements/${action.payload}`);
    }
  },

  extraReducers: (builder) => {
    builder.addCase(loadWallPostsThunk.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
  },
});

export const { addPost, deletePost, addImagePost } = postsSlice.actions;

export default postsSlice.reducer;