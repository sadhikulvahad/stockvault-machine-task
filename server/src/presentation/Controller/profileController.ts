import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IGetProfile } from "../../application/interface/IGetProfile";
import { IResetPasswordRepo } from "../../application/interface/IResetPasswordRepo";
import { AppError } from "../../application/Errors/AppError";

@injectable()
export class ProfileController {
    constructor(
        @inject(TYPES.IGetProfile) private _getProfile: IGetProfile,
        @inject(TYPES.IResetPasswordUsecase) private _resetPassword: IResetPasswordRepo
    ) { }


    async getProfile(req: Request, res: Response) {
        try {
            const token = req.cookies?.refreshToken;

            const user = await this._getProfile.execute(token)

            res.status(200).json({ message: 'User fetched successfully', user })

        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { oldPassword, newPassword, userId } = req.body

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: "Password required" })
            }
            if (!userId) {
                return res.status(400).json({ message: "UserId missing" })
            }

            const resu = await this._resetPassword.execute(oldPassword, newPassword, userId)
            return res.status(200).json({ message: "Password updated successfully" })

        } catch (error: any) {
            let status = 500;
            let message = "Something went wrong";

            if (error instanceof AppError) {
                status = error.statusCode;
                message = error.message;
            } else if (error && typeof error.message === 'string') {
                message = error.message;
            }

            return res.status(status).json({ message });
        }
    }

}