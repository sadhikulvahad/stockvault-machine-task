import { IUserRepository } from "../../infrastructure/DataBase/Interface/IUserRepository";
import { UserModel } from "../../infrastructure/DataBase/Models/UserModel";
import { BaseRepository } from "../../infrastructure/Repository/BaseRepository";
import { User } from "../Entities/User";
import { UserProps } from "../Types/EntityProps";


export class UserRepository extends BaseRepository<User> implements IUserRepository {

    constructor() {
        super(UserModel);
    }

    async create(user: User): Promise<User> {
        const created = await this.model.create({
            phone: user.phone,
            email: user.email,
            password: user.password
        });

        return new User({
            _id: created._id.toString(),
            phone: created.phone,
            email: created.email,
            password: created.password
        });
    }


    async findUserByPhone(phone: string): Promise<User | null> {
        const doc = await this.model.findOne({ phone }).lean<UserProps & { _id: string }>().exec();
        if (!doc) return null;

        // Wrap the plain object in your User entity
        return new User({
            _id: doc._id.toString(),
            phone: doc.phone,
            email: doc.email,
            password: doc.password,
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const doc = await this.model.findOne({ email }).lean<UserProps & { _id: string }>().exec();
        if (!doc) return null;

        return new User({
            _id: doc._id.toString(),
            phone: doc.phone,
            email: doc.email,
            password: doc.password,
        });
    }

}