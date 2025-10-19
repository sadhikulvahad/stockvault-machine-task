import { Router } from "express";
import { container } from "../../infrastructure/DIContainer/container";
import { AuthController } from "../Controller/authController";
import { TYPES } from "../../types";

const router = Router()

const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

export default router;