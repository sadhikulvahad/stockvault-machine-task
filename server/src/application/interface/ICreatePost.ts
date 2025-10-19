import { Post } from "../../domain/Entities/Post";

export interface ICreatePostRepo {
    execute(data: {
        token: string;
        files: Express.Multer.File[];
        titles: string[];
    }): Promise<Post[]>;
}