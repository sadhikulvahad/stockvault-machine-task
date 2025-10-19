import { inject, injectable } from "inversify";
import { ILoginRepo } from "../../interface/ILoginRepo";
import { UserRepository } from "../../../domain/Repository/UserRepository";
import { TYPES } from "../../../types";
import { HashPassword } from "../../../infrastructure/Services/HashPassword";
import { ITokenRepository } from "../../../domain/Interface/ITokenRepository";
import { AppError } from "../../Errors/AppError";
import { LoginDTO } from "../../dto";


@injectable()
export class LoginUsecase implements ILoginRepo {

    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: UserRepository,
        @inject(TYPES.HashService) private _hashService: HashPassword,
        @inject(TYPES.JWTService) private _jwtService: ITokenRepository
    ) { }

    async execute(phoneOrEmail: string, password: string): Promise<LoginDTO> {
        if (!phoneOrEmail || !password) {
            throw new AppError("Phone/Email and password are required", 400);
        }

        const user = await this._userRepository.findUserByEmail(phoneOrEmail);

        if (!user) {
            throw new AppError("Invalid credentials", 400);
        }

        const HashPassword = await this._hashService.compare(password, user.password);

        if (!HashPassword) {
            throw new AppError("Invalid credentials", 400);
        }

        const accessToken = await this._jwtService.generateToken(user._id, user.email)
        const refreshToken = await this._jwtService.generateRefreshToken(user._id, user.email)

        return { accessToken: accessToken, refreshToken: refreshToken };
    }

}