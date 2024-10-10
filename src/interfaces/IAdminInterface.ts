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

export interface IMentorDetails {
	name: string;
	dateOfBirth: string;
	preferredLanguage: string;
	email: string;
	degree: string;
	college: string;
	yearOfGraduation: string;
	jobTitle: string;
	lastWorkedCompany: string;
	yearsOfExperience: string;
	stack: string;
	resume: string;
	degreeCertificate: string;
	experienceCertificate: string;
	isVerified: boolean;
}

export interface IMentorData {
	_id: string;
	name: string;
	email: string;
	isActive: boolean;
	isVerified: string;
}

export interface IQuestion {
	_id: string;
	title: string;
	body: string;
	isAnswered: boolean;
	reply?: string;
}

export interface IUserData {
	_id: string;
	name: string;
	email: string;
	isActive: boolean;
	isVerified: string;
}
