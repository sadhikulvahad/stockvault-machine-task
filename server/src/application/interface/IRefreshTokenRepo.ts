import { RefreshTokenDTO } from "../dto";


export interface IRefreshTokenRepo {
    execute(token: string): Promise<RefreshTokenDTO>;
}