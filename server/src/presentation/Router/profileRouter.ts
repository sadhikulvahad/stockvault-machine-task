import { Router } from "express";
import { container } from "../../infrastructure/DIContainer/container";
import { TYPES } from "../../types";
import { ProfileController } from "../Controller/profileController";
import { AuthMidlware } from "../../infrastructure/Web/AuthMiddlware";


const router = Router();

const profileController = container.get<ProfileController>(TYPES.ProfileController);
const authMidlware = container.get<AuthMidlware>(TYPES.AuthMiddlware)

router.use(authMidlware.auth.bind(authMidlware))

router.get('/', profileController.getProfile.bind(profileController));
router.post('/reset-password', profileController.resetPassword.bind(profileController));


export default router