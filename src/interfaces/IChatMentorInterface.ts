export interface User {
	_id: string;
	name: string;
	image: string;
}

export interface Message {
	_id: string;
	content: string;
	sender: {
		_id: string;
		name: string;
		image: string;
	} | null;
	senderModel: "MentorVarify" | "Mentee";
	chat: {
		_id: string;
	};
}

export interface RootState {
	chat: {
		selectedChat: {
			_id: string;
			mentee: {
				_id: string;
				image: string;
				name: string;
			};
		} | null;
	};
}

export interface MentorChatBodyProps {
	user: User;
}

export interface ICommunityMeet {
	_id: string;
	date: Date;
	startTime: string;
	endTime: string;
	about: string;
	mentorInfo: {
		_id: string;
		name: string;
		image: string;
	};
	RoomId: string;
	image: string;
	stack: string;
}


