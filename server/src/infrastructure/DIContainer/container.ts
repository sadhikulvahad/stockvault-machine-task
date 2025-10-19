import { Container } from "inversify";
import { TYPES } from "../../types";
import { AuthController } from "../../presentation/Controller/authController";
import { ISignupRepo } from "../../application/interface/ISignupRepo";
import { SignupUsecase } from "../../application/useCases/Auth/Signup";
import { HashPassword } from "../Services/HashPassword";
import { IUserRepository } from "../DataBase/Interface/IUserRepository";
import { UserRepository } from "../../domain/Repository/UserRepository";
import { ILoginRepo } from "../../application/interface/ILoginRepo";
import { LoginUsecase } from "../../application/useCases/Auth/Login";
import { JWTService } from "../Services/JWTService";
import { ITokenRepository } from "../../domain/Interface/ITokenRepository";
import { PostController } from "../../presentation/Controller/postController";
import { ProfileController } from "../../presentation/Controller/profileController";
import { ILogoutRepo } from "../../application/interface/ILogoutRepo";
import { Logout } from "../../application/useCases/Auth/Logout";
import { IRefreshTokenRepo } from "../../application/interface/IRefreshTokenRepo";
import { RefreshToken } from "../../application/useCases/Auth/RefreshToken";
import { IGetProfile } from "../../application/interface/IGetProfile";
import { GetProfile } from "../../application/useCases/Profile/GetProfile";
import { IResetPasswordRepo } from "../../application/interface/IResetPasswordRepo";
import { ResetPasswordUsecase } from "../../application/useCases/Profile/ResetPassword";
import { IGetPostRepo } from "../../application/interface/IGetPosts";
import { GetPosts } from "../../application/useCases/Post/GetPost";
import { IPostRepository } from "../DataBase/Interface/IPostRepository";
import { PostRepository } from "../../domain/Repository/PostRepository";
import { MulterService } from "../Web/multer";
import { ICreatePostRepo } from "../../application/interface/ICreatePost";
import { CreatePost } from "../../application/useCases/Post/CreatePost";
import { IDeletePosts } from "../../application/interface/IDeletePost";
import { DeletePosts } from "../../application/useCases/Post/DeletePost";
import { IUpdatePositionRepo } from "../../application/interface/IUpdatePositionRepo";
import { UpdatePosition } from "../../application/useCases/Post/UpdatePosition";
import { IUpdatePostRepo } from "../../application/interface/IUpdatePost";
import { UpdatePost } from "../../application/useCases/Post/UpdatePost";
import { AuthMiddlewareRepo, AuthMidlware } from "../Web/AuthMiddlware";

const container = new Container();

// controllers

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<PostController>(TYPES.PostController).to(PostController);
container.bind<ProfileController>(TYPES.ProfileController).to(ProfileController);

// usecases

container.bind<ISignupRepo>(TYPES.ISignupUsecase).to(SignupUsecase).inSingletonScope();
container.bind<ILoginRepo>(TYPES.ILoginUsecase).to(LoginUsecase).inSingletonScope();
container.bind<ILogoutRepo>(TYPES.ILogoutUsecase).to(Logout).inSingletonScope();
container.bind<IRefreshTokenRepo>(TYPES.IRefreshTokenUsecase).to(RefreshToken).inSingletonScope()
container.bind<IGetProfile>(TYPES.IGetProfile).to(GetProfile).inSingletonScope()
container.bind<IResetPasswordRepo>(TYPES.IResetPasswordUsecase).to(ResetPasswordUsecase).inSingletonScope()
container.bind<IGetPostRepo>(TYPES.IGetPosts).to(GetPosts).inSingletonScope()
container.bind<ICreatePostRepo>(TYPES.ICreatePosts).to(CreatePost).inSingletonScope()
container.bind<IDeletePosts>(TYPES.IDeletePosts).to(DeletePosts).inSingletonScope()
container.bind<IUpdatePositionRepo>(TYPES.IUpdatePosition).to(UpdatePosition).inSingletonScope()
container.bind<IUpdatePostRepo>(TYPES.IUpdatePosts).to(UpdatePost).inSingletonScope()

//services

container.bind<HashPassword>(TYPES.HashService).to(HashPassword).inSingletonScope();
container.bind<ITokenRepository>(TYPES.JWTService).to(JWTService).inSingletonScope();
container.bind<MulterService>(TYPES.MulterService).to(MulterService).inSingletonScope()
container.bind<AuthMiddlewareRepo>(TYPES.AuthMiddlware).to(AuthMidlware).inSingletonScope()

// repositories

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository).inSingletonScope()

export { container };