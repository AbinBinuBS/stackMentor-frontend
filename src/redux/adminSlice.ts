import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "../interfaces/IReduxStore";

const INITIAL_STATE: SliceState = {
	accessToken: "",
	refreshToken: "",
};

const adminSlice = createSlice({
	name: "admin",
	initialState: INITIAL_STATE,
	reducers: {
		adminLogin: (
			state,
			action: PayloadAction<{ accessToken: string; refreshToken: string }>
		) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		},
		adminLogout: (state) => {
			state.accessToken = "";
			state.refreshToken = "";
		},
	},
});

export const { adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
