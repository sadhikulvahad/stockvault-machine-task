import { ObjectId } from "mongoose";
import { PostDTO } from "../../../application/dto";
import { Post } from "../../../domain/Entities/Post";
import { IBaseRepository } from "../../../domain/Interface/IBaseRepository";


export interface IPostRepository extends IBaseRepository<Post> {
    findByAuthorId(authorId: string): Promise<PostDTO[]>;
    deletePost(postion: string): Promise<void>
    findByImagePosition(postion: string): Promise<PostDTO | null>
    updateImagePosition(postId: string | ObjectId, newPosition: number): Promise<void>
    updateImage(position: string, updateData: Partial<PostDTO>) : Promise<PostDTO | null>
}