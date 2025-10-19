
export interface ILogoutRepo {
    execute(token: string): Promise<boolean>;
}