import { inject, injectable } from "inversify";
import { IUpdatePositionRepo } from "../../interface/IUpdatePositionRepo";
import { TYPES } from "../../../types";
import { IPostRepository } from "../../../infrastructure/DataBase/Interface/IPostRepository";
import { AppError } from "../../Errors/AppError";
import { PostDTO } from "../../dto";


@injectable()
export class UpdatePosition implements IUpdatePositionRepo {
    constructor(
        @inject(TYPES.IPostRepository) private _postRepository: IPostRepository
    ) { }

    async execute(positionOneId: string, positionTwoId: string): Promise<void> {

        if (!positionOneId || !positionTwoId) {
            throw new AppError('Image Positions are not mentioned', 400)
        }

        const imageOne = await this._postRepository.findByImagePosition(positionOneId)

        if (!imageOne) {
            throw new AppError("Image is not found", 400)
        }


        const imageTwo = await this._postRepository.findByImagePosition(positionTwoId)

        if (!imageTwo) {
            throw new AppError("Image is not found", 400)
        }

        const temp = imageOne.imagePosition
        imageOne.imagePosition = imageTwo.imagePosition
        imageTwo.imagePosition = temp

        await Promise.all([
            this._postRepository.updateImagePosition(imageOne._id!, imageOne.imagePosition),
            this._postRepository.updateImagePosition(imageTwo._id!, imageTwo.imagePosition)
        ]);

    }
}