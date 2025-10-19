import mongoose, { Schema } from "mongoose";
import { UserProps } from "../../../domain/Types/EntityProps";


const UserSchema = new Schema<UserProps>({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

export const UserModel = mongoose.model<UserProps>("User", UserSchema);