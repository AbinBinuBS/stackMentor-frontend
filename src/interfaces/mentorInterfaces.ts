import { ObjectId } from "mongoose";

export interface MentorVerifyFormValues {
	name: string;
	dateOfBirth: string;
	image: File | null;
	about: string;
	degree: string;
	college: string;
	yearOfGraduation: string;
	jobTitle: string;
	lastWorkedCompany: string;
	yearsOfExperience: string;
	stack: string;
	resume: File | null;
	degreeCertificate: File | null;
	experienceCertificate: File | null;
}

export interface ISlotMentor {
	_id: ObjectId;
	date: Date;
	startTime: string;
	endTime: string;
	price: number;
	bookingData: {
		_id: ObjectId;
		userId: ObjectId;
		status: string;
		roomId: string;
		isAllowed: boolean;
	};
	isBooked: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface MentorId {
	_id: ObjectId;
	name: string;
	email: string;
	password: string;
	isActive: boolean;
	isVerified: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

export interface MentorVerification {
	_id: ObjectId;
	mentorId: MentorId;
	name: string;
	dateOfBirth: Date;
	image: string;
	about: string;
	degree: string;
	college: string;
	yearOfGraduation: string;
	jobTitle: string;
	lastWorkedCompany: string;
	yearsOfExperience: number;
	stack: string;
	resume: string;
	degreeCertificate: string;
	experienceCertificate: string;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
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

export interface IQuestion {
	_id: string;
	title: string;
	body: string;
	isAnswered: boolean;
	reply?: string;
}
