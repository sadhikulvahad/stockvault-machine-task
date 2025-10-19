import { Types } from "mongoose";


export type UserProps = {
    _id?: string;
    phone: string;
    email: string;
    password?: string;
};


export type PostProps = {
    _id: string;
    title: string;
    // content: string;
    authorId: Types.ObjectId;
    imageUrl: string;
    imagePosition: number
    isDeleted : boolean
};