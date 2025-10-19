import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ITokenRepository } from "../../domain/Interface/ITokenRepository";
import { IUserRepository } from "../DataBase/Interface/IUserRepository";
import { IRefreshTokenRepo } from "../../application/interface/IRefreshTokenRepo";


export interface AuthMiddlewareRepo {
    auth(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class AuthMidlware implements AuthMiddlewareRepo {
    constructor(
        @inject(TYPES.JWTService) private _tokenService: ITokenRepository,
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IRefreshTokenUsecase) private _refreshToken: IRefreshTokenRepo
    ) { }

    async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization
            const accessToken = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null

            if (accessToken) {
                try {
                    const decoded = await this._tokenService.verifyToken(accessToken)
                    if (decoded) {
                        res.status(403).json({ error: 'Account is Invalid' });
                        return;
                    }
                    next()
                } catch (error: any) {
                    if (error.name !== 'TokenExpiredError') {
                        throw error;
                    }
                }
            }

            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                res.status(401).json({ error: 'Authorization required' });
                return;
            }

            const result = await this._refreshToken.execute(refreshToken)
            if (!result.success || !result.accessToken || !result.refreshToken) {
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                });
                res.status(401).json({ error: 'Session expired' });
                return;
            }

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.header('x-access-token', result.accessToken);

            const decoded = await this._tokenService.verifyToken(result.accessToken);
            if (!decoded) {
                res.status(403).json({ error: 'Account is Invalid' });
                return;
            }
            next()

        } catch (error: any) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
            });
            res.status(401).json({
                error: 'Authentication failed',
                code: error.name || 'UNKNOWN_ERROR',
            });
        }
    }
}