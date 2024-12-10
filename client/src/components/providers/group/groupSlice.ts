import { createSlice } from "@reduxjs/toolkit"
import { getAllGroups } from "./groupThunk"
import { UserDataType } from "../../../schemas/authSchema"


export type groupDataType = {
    id: number,
    title: string,
    description: string,
    ownerid: number,
    chatflag: boolean,
    Owner: {
      id: number,
      name: string,
      email: string,
      nick: string
    },
    GroupUser: UserDataType[] | []
}

type groupSliceType = {
    groups: groupDataType[],
    error: null | string
}
const initialState: groupSliceType = {
    groups: [],
    error: null
}

export const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getAllGroups.fulfilled, (state, action) => {
            state.groups = action.payload
        })
        .addCase(getAllGroups.rejected, (state) => {
            state.error = 'ошибка получения всех групп'
        })
    },
})

export default groupSlice.reducer