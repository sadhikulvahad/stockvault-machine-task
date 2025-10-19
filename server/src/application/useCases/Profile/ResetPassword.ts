import { inject, injectable } from "inversify";
import { AppError } from "../../Errors/AppError";
import { IResetPasswordRepo } from "../../interface/IResetPasswordRepo";
import { TYPES } from "../../../types";
import { IUserRepository } from "../../../infrastructure/DataBase/Interface/IUserRepository";
import { HashPassword } from "../../../infrastructure/Services/HashPassword";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordRepo {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
        @inject(TYPES.HashService) private _hashService: HashPassword
    ) { }

    async execute(oldPassword: string, newPassword: string, userId: string): Promise<boolean> {
        if (!oldPassword || !newPassword) {
            throw new AppError('Password required', 400)
        }

        if (!userId) {
            throw new AppError('UserId missing', 400)
        }

        const user = await this._userRepo.findById(userId)

        if (!user) {
            throw new AppError("User not found", 400)
        }

        const isPasswordCorrect = await this._hashService.compare(oldPassword, user.password)

        if (!isPasswordCorrect) {
            throw new AppError("Your Current Password is Incorrect", 400)
        }

        const hashedPassword = await this._hashService.hash(newPassword)

        await this._userRepo.update(userId, { password: hashedPassword })

        return true

    }
}