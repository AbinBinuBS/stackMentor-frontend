export interface Message {
	_id: string;
	content: string;
	sender: string;
	senderModel: string;
	chat: {
		_id: string;
		chatName: string;
	};
	createdAt: Date;
  	updatedAt: Date;
}

export interface User {
	id: string;
	name: string;
	image: string;
}

export interface RootState {
	chat: {
		selectedChat: {
			_id: string;
			mentor: User;
		} | null;
	};
}


export interface User {
	id: string;
	name: string;
	image: string;
}