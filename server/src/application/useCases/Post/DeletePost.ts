import { inject, injectable } from "inversify";
import { IDeletePosts } from "../../interface/IDeletePost";
import { TYPES } from "../../../types";
import { IPostRepository } from "../../../infrastructure/DataBase/Interface/IPostRepository";
import { AppError } from "../../Errors/AppError";


@injectable()
export class DeletePosts implements IDeletePosts {
    constructor(
        @inject(TYPES.IPostRepository) private _postRepository: IPostRepository
    ) { }

    async execute(postId: string): Promise<void> {


        if (!postId) {
            throw new AppError("Post missing", 400)
        }

        return this._postRepository.deletePost(postId)
    }

}