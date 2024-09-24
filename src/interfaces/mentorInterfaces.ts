import { ObjectId } from "mongoose";

export interface MentorVerifyFormValues {
    name: string; dateOfBirth: string; image: File | null; about:string;
    degree: string; college: string; yearOfGraduation: string;
    jobTitle: string; lastWorkedCompany: string; yearsOfExperience: string; stack: string;
    resume: File | null; degreeCertificate: File | null; experienceCertificate: File | null;
}

export interface ISlotMentor {
    _id: ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    price: number;
    mentorId: ObjectId;
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