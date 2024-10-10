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


  export interface Mentor {
    _id: string;
    name: string;
    mentorId: string;
    image?: string;
    about?: string;
    yearsOfExperience: number;
  }


  export type Level = 'beginner' | 'intermediate' | 'expert';
 

  export interface MenteeSingleMentorBodyProps {
    slots: ISlot[] | null;
    onSlotUpdate: (sessionId: ObjectId) => void;
    onBackClick?: () => void; 
}


export interface ISession {
  id: string;
  name: string;
}

export interface FormValues {
  title: string;
  body: string;
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

export interface MenteeSingleMentorSidebarProps {
  mentor:IMentorVerification | null
}

export interface MentorData {
  _id: string;
  name: string;
  image: string;
}

export interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  mentorData: MentorData;
  status: string;
  roomId: string;
  isAllowed: boolean;
}

export interface RescheduleOption {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
}

export interface ApiResponse {
  availableSlots: RescheduleOption[];
  message: string;
}


export interface QASidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export interface IWallet {
  _id:string;
  name:string;
  wallet:string;
}

export interface Slot {
	_id: string;
	date: string;
	startTime: string;
	endTime: string;
	bookedSlots: Array<{
		status?: string;
	}>;
}