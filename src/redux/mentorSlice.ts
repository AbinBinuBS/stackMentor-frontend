import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "../interfaces/IReduxStore";

const INITIAL_STATE: SliceState = {
	accessToken: "",
	refreshToken: "",
};

const mentorSlice = createSlice({
	name: "mentor",
	initialState: INITIAL_STATE,
	reducers: {
		mentorLogin: (
			state,
			action: PayloadAction<{ accessToken: string; refreshToken: string }>
		) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		},
		mentorLogout: (state) => {
			state.accessToken = "";
			state.refreshToken = "";
		},
	},
});

export const { mentorLogin, mentorLogout } = mentorSlice.actions;
export default mentorSlice.reducer;
