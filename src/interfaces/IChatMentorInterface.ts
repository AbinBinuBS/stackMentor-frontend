import { Schema } from 'mongoose';
export interface User {
	_id: string;
	name: string;
	image: string;
}

export interface Message {
	_id: string;
	chat: {
	  _id: string;
	  chatName: string;
	  mentor: string;
	  mentee: string;
	  createdAt: string;
	};
	content: string;
	createdAt: string;
	readBy: string[];
	sender: {
	  _id: string;
	  name: string;
	};
	senderModel: 'MentorVarify' | 'Mentee';
	updatedAt: string;
	__v: number;
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

export interface RootStateMentor {
	chat: {
		selectedChatMentor: {
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


export interface INotification {
	sender:string;
	chat: Schema.Types.ObjectId;
	senderName: string;
	messageText: string;
  }