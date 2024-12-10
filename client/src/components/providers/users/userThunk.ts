import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

export const getAllUsers = createAsyncThunk('users/getAllUsers', async () => {
    const users = await axiosInstance.get('/users')
    console.log(users.data)
    return users.data
});