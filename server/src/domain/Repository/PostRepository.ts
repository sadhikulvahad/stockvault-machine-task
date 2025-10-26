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
        const docs = await this.model.find({ authorId, isDeleted: false },).sort({ imagePosition: 1 }).lean<PostDTO[]>().exec();

        const posts: PostDTO[] = docs.map(doc => ({
            _id: doc._id,
            title: doc.title,
            authorId: doc.authorId,
            imageUrl: doc.imageUrl,
            imagePosition: doc.imagePosition,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }));

        return posts;
    }

    async deletePost(postId: string): Promise<void> {
        await this.model.updateOne(
            { _id: postId, isDeleted: false },
            { $set: { isDeleted: true } }
        );
    }

    async findByImagePosition(id: string): Promise<PostDTO | null> {
        const post = await this.model.findOne({ _id: id, isDeleted: false }).lean();
        return post as PostDTO | null;
    }

    async updateImagePosition(postId: string, newPosition: number): Promise<void> {
        await this.model.updateOne({ _id: postId, isDeleted: false }, { imagePosition: newPosition });
    }

    async updateImage(id: string, updateData: Partial<PostDTO>): Promise<PostDTO | null> {
        const updatedPost = await this.model
            .findOneAndUpdate(
                { _id: id, isDeleted: false },
                { $set: updateData },
                { new: true }
            )
            .lean()
            .exec();

        return updatedPost as PostDTO | null;
    }


}