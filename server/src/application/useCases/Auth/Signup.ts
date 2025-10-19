import { inject, injectable } from "inversify";
import { ISignupRepo } from "../../interface/ISignupRepo";
import { TYPES } from "../../../types";
import { HashPassword } from "../../../infrastructure/Services/HashPassword";
import { IUserRepository } from "../../../infrastructure/DataBase/Interface/IUserRepository";
import { User } from "../../../domain/Entities/User";
import { AppError } from "../../Errors/AppError";

@injectable()
export class SignupUsecase implements ISignupRepo {

    constructor(
        @inject(TYPES.HashService) private _hashService: HashPassword,
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository
    ) { }


    async execute(phone: string, email: string, password: string): Promise<void> {

        if (!phone || !email || !password) {
            throw new Error("All fields are required");
        }

        const isPhoneExist = await this._userRepository.findUserByPhone(phone);

        if (isPhoneExist) {
            throw new AppError("Phone number already exists", 400);
        }

        const isEmailExist = await this._userRepository.findUserByEmail(email);

        if (isEmailExist) {
            throw new AppError("Email already exists", 400);
        }

        const hashedPassword = await this._hashService.hash(password);

        const newUser = new User({
            phone,
            email,
            password: hashedPassword
        });

        await this._userRepository.create(newUser);
    }
}