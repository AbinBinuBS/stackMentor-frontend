import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "../interfaces/IReduxStore";

const INITIAL_STATE : SliceState = {
    accessToken : "",
    refreshToken : ""
}

const menteeSlice =createSlice({
    name:"mentee",
    initialState:INITIAL_STATE,
    reducers:{
        menteeLogin: (state,action:PayloadAction<{accessToken :string; refreshToken:string}>) =>{
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        menteeLogout: (state) =>{
            state.accessToken = "";
            state.refreshToken = "";
        }
    }
})

export const {menteeLogin , menteeLogout} = menteeSlice.actions;
export default menteeSlice.reducer