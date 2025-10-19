import { LoginDTO } from "../dto";


export interface ILoginRepo {
    execute(phoneOrEmail: string, password: string): Promise<LoginDTO>;
}