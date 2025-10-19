import { Router } from "express";
import { container } from "../../infrastructure/DIContainer/container";
import { PostController } from "../Controller/postController";
import { TYPES } from "../../types";
import { MulterService } from "../../infrastructure/Web/multer";
import { AuthMidlware } from "../../infrastructure/Web/AuthMiddlware";

const router = Router()

const postController = container.get<PostController>(TYPES.PostController);
const multerService = container.get<MulterService>(TYPES.MulterService)


const authMidlware = container.get<AuthMidlware>(TYPES.AuthMiddlware)

router.use(authMidlware.auth.bind(authMidlware))

router.get('/', postController.getPosts.bind(postController))
router.post('/', multerService.uploadPost, postController.createPost.bind(postController))
router.put('/:imagePosition', multerService.uploadPost, postController.updatePost.bind(postController))
router.put('/update-position', postController.updatePosition.bind(postController))
router.delete('/:postId', postController.deletePost.bind(postController))

export default router;

