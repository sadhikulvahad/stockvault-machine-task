import { User } from "../../../domain/Entities/User";
import { IBaseRepository } from "../../../domain/Interface/IBaseRepository";


export interface IUserRepository extends IBaseRepository<User> {
    findUserByPhone(phone: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
}