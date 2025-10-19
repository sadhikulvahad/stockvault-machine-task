import { jwtDecode } from "jwt-decode";
import { AppError } from "../../Errors/AppError";
import { IGetProfile } from "../../interface/IGetProfile";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { IUserRepository } from "../../../infrastructure/DataBase/Interface/IUserRepository";
import { SafeUserDTO } from "../../dto";


interface CustomJwtPayload {
    id: string;
    email?: string;
    iat?: number;
    exp?: number;
}

@injectable()
export class GetProfile implements IGetProfile {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepo: IUserRepository
    ) { }

    async execute(token: string): Promise<SafeUserDTO> {
        if (!token) {
            throw new AppError('Invalid Token', 401)
        }

        const decode = jwtDecode<CustomJwtPayload>(token)

        const user = await this._userRepo.findById(decode?.id)
        if (!user) {
            throw new AppError('User not found, Invalid token', 401)
        }
        const safeUser: SafeUserDTO = {
            id: user._id.toString(),
            phone: user.phone,
            email: user.email,
        }

        return safeUser;
    }
}