import { ObjectId } from "mongoose";


export interface LoginDTO {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenDTO {
    success: boolean;
    accessToken: string;
    refreshToken: string;
}

export type SafeUserDTO = {
    id?: string;
    phone: string;
    email: string;
};

export interface PostDTO {
    _id?: string | ObjectId
    title: string;
    authorId: string;
    imageUrl: string;
    imagePosition: number;
    createdAt: Date;
    updatedAt: Date;
}
