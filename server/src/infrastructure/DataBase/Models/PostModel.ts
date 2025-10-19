import mongoose, { Schema } from "mongoose";
import { PostProps } from "../../../domain/Types/EntityProps";


const PostSchema = new Schema<PostProps>({
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imagePosition: {
        type: Number,
        required: true
    },
    isDeleted : {
        type: Boolean,
        default : false
    }
}, {
    timestamps: true
})

export const PostModel = mongoose.model<PostProps>('Post', PostSchema);