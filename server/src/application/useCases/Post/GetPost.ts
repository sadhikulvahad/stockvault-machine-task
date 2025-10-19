import { jwtDecode } from "jwt-decode";
import { Post } from "../../../domain/Entities/Post";
import { AppError } from "../../Errors/AppError";
import { IGetPostRepo } from "../../interface/IGetPosts";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { IPostRepository } from "../../../infrastructure/DataBase/Interface/IPostRepository";
import { PostDTO } from "../../dto";

interface CustomJwtPayload {
    id: string;
    email?: string;
    iat?: number;
    exp?: number;
}


@injectable()
export class GetPosts implements IGetPostRepo {
    constructor(
        @inject(TYPES.IPostRepository) private _postRepository: IPostRepository
    ) { }

    async execute(token: string): Promise<PostDTO[]> {
        if (!token) {
            throw new AppError('No Token Provided', 401)
        }

        const decoded = jwtDecode<CustomJwtPayload>(token);

        const posts = await this._postRepository.findByAuthorId(decoded?.id);

        const mappedPosts = posts.map((post) => ({
            ...post,
            imageUrl: `${process.env.BASE_URL}/uploads/${post.imageUrl}`,
        }));

        return mappedPosts;
    }
}