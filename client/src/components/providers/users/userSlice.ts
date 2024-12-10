import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "./userThunk";
import type { UserDataType } from "../../../schemas/authSchema";

export type UserSliceType = {
    users: UserDataType[];
    error: string | null
}

const initialState: UserSliceType = {
    users: [],
    error: null
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.users = action.payload
        })
        .addCase(getAllUsers.rejected, (state) => {
            state.error = 'ошибка получения всех юзеров'
        })
    }
})

export default userSlice.reducer