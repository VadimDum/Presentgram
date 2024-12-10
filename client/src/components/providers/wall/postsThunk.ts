import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";
import { UserType } from "../../../schemas/authSchema";

export type WallPostsState = {
    posts: WallPostsT[] | undefined;
}

export type WallPostsT = {
  id?: number;
  userid: number | undefined;
  wallreaction: string | null;
  wallreactionimg: FormData | null | undefined;
  wallreactionimgcurrent?: string | null;
  authorid?: number | null;
  Userwallauthor?: UserType | undefined;
  Userwallprofile?: { userid: number | undefined };
};

export const loadWallPostsThunk = createAsyncThunk(
    'posts/loadWallPostsThunk',
    async (id:string) => {
        try {
            const response = await axiosInstance.get<WallPostsT[]>(`/wallelements/${id}`);
            return response.data
        } catch (error) {
            console.log('Ошибка запроса при загрузке постов', error);
    }}
);