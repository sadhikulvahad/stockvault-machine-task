import mongoose from "mongoose";
import { PostDTO } from "../../application/dto";
import { IPostRepository } from "../../infrastructure/DataBase/Interface/IPostRepository";
import { PostModel } from "../../infrastructure/DataBase/Models/PostModel";
import { BaseRepository } from "../../infrastructure/Repository/BaseRepository";
import { Post } from "../Entities/Post";


export class PostRepository extends BaseRepository<Post> implements IPostRepository {

    constructor() {
        super(PostModel)
    }

    async findByAuthorId(authorId: string): Promise<PostDTO[]> {
        const docs = await this.model.find({ authorId, isDeleted: false },).sort({ imagePosition: 1 }).lean().exec();

        const posts: PostDTO[] = docs.map(doc => ({
            title: doc.title,
            authorId: doc.authorId,
            imageUrl: doc.imageUrl,
            imagePosition: doc.imagePosition,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }));

        return posts;
    }

    async findByImagePositionAndUpdate(position: number): Promise<void> {
        await this.model.updateOne(
            { imagePosition: position, isDeleted: false },
            { $set: { isDeleted: true } }
        );
    }

    async findByImagePosition(position: number): Promise<PostDTO | null> {
        const post = await this.model.findOne({ imagePosition: position, isDeleted: false }).lean();
        return post as PostDTO | null;
    }

    async updateImagePosition(postId: string, newPosition: number): Promise<void> {
        await this.model.updateOne({ _id: postId, isDeleted: false }, { imagePosition: newPosition });
    }

    async updateImage(position: number, updateData: Partial<PostDTO>): Promise<PostDTO | null> {
        const updatedPost = await this.model
            .findOneAndUpdate(
                { imagePosition: position, isDeleted: false },
                { $set: updateData },
                { new: true }
            )
            .lean()
            .exec();

        return updatedPost as PostDTO | null;
    }


}