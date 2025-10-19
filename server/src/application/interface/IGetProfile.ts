import { SafeUserDTO } from "../dto";


export interface IGetProfile {
    execute(token: string): Promise<SafeUserDTO>
}