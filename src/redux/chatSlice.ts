import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
	selectedChat: any | null;
	chats: any[];
	notification: any[];
	selectedChatMentor:any | null;
	mentorNotification: any[];
}

const initialState: ChatState = {
	selectedChat: null,
	chats: [],
	notification: [],
	selectedChatMentor:null,
	mentorNotification: []
};

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setSelectedChat: (state, action: PayloadAction<any>) => {
			state.selectedChat = action.payload;
		},
		setSelectedChatMentor: (state, action: PayloadAction<any>) => {
			state.selectedChatMentor = action.payload;
		},
		resetSelectedChatMentor: (state) => {
			state.selectedChatMentor = null; 
		},
		resetSelectedChat: (state) => {
			state.selectedChat = null; 
		},
		setChats: (state, action: PayloadAction<any[]>) => {
			state.chats = action.payload;
		},
		setNotification: (state, action: PayloadAction<any[]>) => {
			state.notification = action.payload;
		},
		addNotification: (state, action: PayloadAction<any>) => {
			state.notification.push(action.payload);
		},
		clearNotifications: (state) => {
			state.notification = [];
		},
		setMentorNotification: (state, action: PayloadAction<any[]>) => {
			state.mentorNotification = action.payload;
		},
		addMentorNotification: (state, action: PayloadAction<any>) => {
			state.mentorNotification.push(action.payload);
		},
		clearMentorNotifications: (state) => {
			state.mentorNotification = [];
		},
	},
});

export const {
	setSelectedChat,
	setSelectedChatMentor,
	resetSelectedChatMentor,
	resetSelectedChat,
	setChats,
	setNotification,
	addNotification,
	clearNotifications,
	setMentorNotification,
	addMentorNotification,
	clearMentorNotifications
} = chatSlice.actions;

export default chatSlice.reducer;
