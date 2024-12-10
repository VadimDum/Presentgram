import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

export const getAllGroups = createAsyncThunk('/groups/getAllGroups', async () => {
    const groups = await axiosInstance.get('/groups')

    return groups.data
});