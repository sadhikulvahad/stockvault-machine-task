
import { inject, injectable } from "inversify";

import { jwtDecode } from "jwt-decode";
import { ICreatePostRepo } from "../../interface/ICreatePost";
import { IPostRepository } from "../../../infrastructure/DataBase/Interface/IPostRepository";
import { TYPES } from "../../../types";
import { Post } from "../../../domain/Entities/Post";
import { AppError } from "../../Errors/AppError";
import { Types } from "mongoose";

@injectable()
export class CreatePost implements ICreatePostRepo {
    constructor(
        @inject(TYPES.IPostRepository) private _postRepository: IPostRepository
    ) { }

    async execute({
        token,
        files,
        titles,
    }: {
        token: string;
        files: Express.Multer.File[];
        titles: string[];
    }): Promise<Post[]> {

        if (!token) throw new AppError("Token missing", 401);
        if (!files || files.length === 0)
            throw new AppError("No files uploaded", 400);

        const decoded = jwtDecode<{ id: string }>(token);
        const authorId = decoded.id;

        const existingPost = await this._postRepository.findByAuthorId(authorId);

        const lastPost = existingPost.sort((a, b) => b.imagePosition.valueOf() - a.imagePosition.valueOf())[0];

        const posts = files.map((file, index) => ({
            authorId: new Types.ObjectId(authorId),
            title: titles[index] || "Untitled",
            imageUrl: file.filename,
            imagePosition: lastPost?.imagePosition.valueOf() || 0 + 1,
        }));

        return await this._postRepository.insertMany(posts);

    }
}
