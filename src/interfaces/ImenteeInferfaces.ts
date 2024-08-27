import mongoose,{ObjectId} from "mongoose";



export interface IMentorVerification {
    name: string;
    image: string;
    yearsOfExperience: string | number;
  }

  export interface ISlot {
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