

export const TYPES = {

    //controllers
    AuthController: Symbol.for("AuthController"),
    PostController: Symbol.for("PostController"),
    ProfileController: Symbol.for("ProfileController"),

    //usecases
    ISignupUsecase: Symbol.for("SignupUsecase"),
    ILoginUsecase: Symbol.for("LoginUsecase"),
    ILogoutUsecase: Symbol.for("LogoutUsecase"),
    IResetPasswordUsecase: Symbol.for("ResetPasswordUsecase"),
    IRefreshTokenUsecase: Symbol.for("RefreshTokenUsecase"),
    IGetProfile : Symbol.for("GetProfile"),
    IGetPosts : Symbol.for('IGetPosts'),
    ICreatePosts : Symbol.for('ICreatePosts'),
    IUpdatePosts : Symbol.for('IUpdatePosts'),
    IDeletePosts : Symbol.for('IDeletePosts'),
    IUpdatePosition: Symbol.for("IUpdatePosition"),

    //services
    HashService: Symbol.for("HashService"),
    JWTService: Symbol.for("JWTService"),
    MulterService : Symbol.for('MulterService'),
    AuthMiddlware : Symbol.for('AuthMiddleare'),


    //repositories
    IUserRepository: Symbol.for("IUserRepository"),
    IPostRepository: Symbol.for("IPostRepository")

}