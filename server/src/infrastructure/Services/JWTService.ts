import jwt from 'jsonwebtoken';
import { ITokenRepository } from '../../domain/Interface/ITokenRepository';

export class JWTService implements ITokenRepository {
    private accessTokenSecret: string = process.env.JWT_SECRET || "";
    private refreshTokenSecret: string = process.env.JWT_REFRESH_SECRET || "";

    constructor() {
        if (!this.accessTokenSecret || !this.refreshTokenSecret) {
            throw new Error("JWT secrets are not defined in environment variables");
        }
    }

    generateToken(id: string, email: string,): string {
        return jwt.sign({ id, email }, this.accessTokenSecret, { expiresIn: '15m' });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (error) {
            return null;
        }
    }

    generateRefreshToken(id: string, email: string): string {
        return jwt.sign({ id, email }, this.refreshTokenSecret, { expiresIn: '7d' });
    }

    verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (error) {
            return null;
        }
    }
}