import { injectable } from "inversify";
import { jwtDecode } from "jwt-decode";


@injectable()
export class Logout {
    constructor() { }

    async execute(token: string): Promise<boolean> {
        const decoded = jwtDecode<{ exp: number }>(token);

        if (!decoded) {
            throw new Error('Invalid Token')
        }

        const expiresIn = decoded.exp! - Math.floor(Date.now() / 1000);

        if (expiresIn <= 0) {
            return true
        }
        return true
    }

}