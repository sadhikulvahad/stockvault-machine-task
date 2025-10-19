import { Request, RequestHandler } from "express";
import { injectable } from "inversify";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

@injectable()
export class MulterService {
    public uploadPost: RequestHandler;

    constructor() {
        this.uploadPost = this.createPostUploader();
    }

    private createPostUploader(): RequestHandler {
        const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            const originalname = file.originalname || "";
            const ext = path.extname(originalname).toLowerCase();
            const sanitizedMime = file.mimetype.toLowerCase();

            const allowedMimeTypes = ["image/jpeg", "image/png"];
            const allowedExtensions = [".jpeg", ".jpg", ".png"];

            if (allowedMimeTypes.includes(sanitizedMime) && allowedExtensions.includes(ext)) {
                cb(null, true);
            } else {
                cb(new Error(`Invalid file: ${originalname} (${sanitizedMime})`));
            }
        };

        const uploadDir = path.join(__dirname, '../../uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '../../uploads')); // choose a folder to store
            },
            filename: (req, file, cb) => {
                const uniqueName = Date.now() + '-' + file.originalname;
                cb(null, uniqueName);
            }
        });

        return multer({
            storage: storage,
            fileFilter,
            limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
        }).array('posts', 10);
    }
}
