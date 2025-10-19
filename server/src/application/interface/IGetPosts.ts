import { Post } from "../../domain/Entities/Post";
import { PostDTO } from "../dto";

export interface IGetPostRepo {
    execute(token: string): Promise<PostDTO[]>
}