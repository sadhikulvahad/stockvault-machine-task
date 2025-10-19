import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../types";
import { ISignupRepo } from "../../application/interface/ISignupRepo";
import { ILoginRepo } from "../../application/interface/ILoginRepo";
import { ILogoutRepo } from "../../application/interface/ILogoutRepo";
import { IRefreshTokenRepo } from "../../application/interface/IRefreshTokenRepo";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.ISignupUsecase) private _signupUsecase: ISignupRepo,
        @inject(TYPES.ILoginUsecase) private _loginUsecase: ILoginRepo,
        @inject(TYPES.ILogoutUsecase) private _logoutUsecase: ILogoutRepo,
        @inject(TYPES.IRefreshTokenUsecase) private _refreshToken: IRefreshTokenRepo
    ) { }


    async signup(req: Request, res: Response) {
        try {
            const { phone, email, password } = req.body;

            if (!phone || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            if (phone.length < 10 || phone.length > 10) {
                return res.status(400).json({ error: 'Phone number must be 10 digits' });
            }

            await this._signupUsecase.execute(phone, email, password);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const tokens = await this._loginUsecase.execute(email, password);
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
                .header("x-access-token", tokens.accessToken).
                status(200).json(
                    {
                        accessToken: tokens.accessToken,
                        message: 'Login successful'
                    });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async logout(req: Request, res: Response) {
        try {

            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token is required' });
            }

            const result = await this._logoutUsecase.execute(token);

            if (!result) {
                return res.status(400).json({ message: 'Something Wrong in logging out', success: false })
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            });

            res.status(200).json({ message: 'Logout successful' });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token required' });
            }

            const result = await this._refreshToken.execute(refreshToken);
            if (!result.success) {
                return res.status(401).json({
                    success: false,
                    error: 'Token revoked',
                    code: 'TOKEN_INVALID'
                });
            }

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.header('x-access-token', result.accessToken);

            return res.json({ accessToken: result.accessToken });
        } catch (error: unknown) {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
}

