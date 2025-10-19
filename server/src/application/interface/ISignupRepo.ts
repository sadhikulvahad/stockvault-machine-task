

export interface ISignupRepo {
    execute(phone: string, email: string, password: string): Promise<void>;
}