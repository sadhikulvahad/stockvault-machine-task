

export interface ITokenRepository {
    generateToken(id: string, email: string): string;
    verifyToken(token: string): object | null;
    generateRefreshToken(id: string, email: string): string;
    verifyRefreshToken(token: string): object | null;
}