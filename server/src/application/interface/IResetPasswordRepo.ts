

export interface IResetPasswordRepo {
    execute (oldPassword: string, newPassword: string, userId : string) : Promise<boolean>
}