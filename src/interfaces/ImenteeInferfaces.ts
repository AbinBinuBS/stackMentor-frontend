import {ObjectId} from "mongoose";



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


  export interface IQaData {
    _id : unknown;
    title: string;
    body: string;
    reply?: string;
    isAnswered?:boolean;
    menteeId?:{_id:string,name:string} | undefined
    mentorId?: {_id:string,name:string} | undefined
  }


  export interface StoreData{
    mentee:{
      accessToken : string;
      refreshToken : string;
    }
  }