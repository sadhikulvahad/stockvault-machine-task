import { PostDTO } from "../../../application/dto";
import { Post } from "../../../domain/Entities/Post";
import { IBaseRepository } from "../../../domain/Interface/IBaseRepository";


export interface IPostRepository extends IBaseRepository<Post> {
    findByAuthorId(authorId: string): Promise<PostDTO[]>;
    findByImagePositionAndUpdate(postion: number): Promise<void>
    findByImagePosition(postion: number): Promise<PostDTO | null>
    updateImagePosition(postId: string, newPosition: number): Promise<void>
    updateImage(position: number, updateData: Partial<PostDTO>) : Promise<PostDTO | null>
}