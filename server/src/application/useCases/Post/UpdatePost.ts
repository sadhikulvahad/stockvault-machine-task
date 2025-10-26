import { inject, injectable } from "inversify";
import { IUpdatePostRepo } from "../../interface/IUpdatePost";
import { TYPES } from "../../../types";
import { IPostRepository } from "../../../infrastructure/DataBase/Interface/IPostRepository";
import { AppError } from "../../Errors/AppError";
import { PostDTO } from "../../dto";


@injectable()
export class UpdatePost implements IUpdatePostRepo {
    constructor(
        @inject(TYPES.IPostRepository) private _postRepository: IPostRepository
    ) { }

    async execute(id: string, newImageName: string | undefined, title: string): Promise<PostDTO | null> {
        const existingPost = await this._postRepository.findByImagePosition(id);
        if (!existingPost) {
            throw new AppError('Post not found', 404)
        }

        console.log(newImageName)
        let imageUrl;
        if (newImageName) {
            imageUrl = newImageName;
        } else {
            imageUrl = existingPost.imageUrl
        }
        const updatedPost = await this._postRepository.updateImage(id, { imageUrl: imageUrl, title: title });

        return updatedPost
    }
}