import { inject, injectable } from "inversify";
import { IRefreshTokenRepo } from "../../interface/IRefreshTokenRepo";
import { TYPES } from "../../../types";
import { ITokenRepository } from "../../../domain/Interface/ITokenRepository";
import { IUserRepository } from "../../../infrastructure/DataBase/Interface/IUserRepository";

interface DecodedToken {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

@injectable()
export class RefreshToken implements IRefreshTokenRepo {
  constructor(
    @inject(TYPES.JWTService) private _tokenService: ITokenRepository,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository
  ) {}

  async execute(token: string) {
    const decoded = (await this._tokenService.verifyRefreshToken(token)) as DecodedToken;

    const user = await this._userRepository.findById(decoded.id);
    if (!user) throw new Error("User not found");

    const newAccessToken = await this._tokenService.generateToken(decoded.id, user.email);
    const newRefreshToken = await this._tokenService.generateRefreshToken(user._id, user.email);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
