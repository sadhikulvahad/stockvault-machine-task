import { Express, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IGetPostRepo } from "../../application/interface/IGetPosts";
import { jwtDecode } from "jwt-decode";
import { ICreatePostRepo } from "../../application/interface/ICreatePost";
import { IDeletePosts } from "../../application/interface/IDeletePost";
import { IUpdatePositionRepo } from "../../application/interface/IUpdatePositionRepo";
import { IUpdatePostRepo } from "../../application/interface/IUpdatePost";


@injectable()
export class PostController {
    constructor(
        @inject(TYPES.IGetPosts) private _getPosts: IGetPostRepo,
        @inject(TYPES.ICreatePosts) private _createPosts: ICreatePostRepo,
        @inject(TYPES.IDeletePosts) private _deletePosts: IDeletePosts,
        @inject(TYPES.IUpdatePosition) private _updatePosition: IUpdatePositionRepo,
        @inject(TYPES.IUpdatePosts) private _updatePosts: IUpdatePostRepo
    ) { }

    async createPost(req: Request, res: Response) {
        try {
            const { token } = req.body
            const files = req.files as Express.Multer.File[]
            const titles = Array.isArray(req.body.titles) ? req.body.titles : [req.body.titles];

            if (!token) {
                return res.status(400).json({ error: "Token not provided" });
            }

            const decoded = jwtDecode(token) as { id: string };
            const authorId = decoded.id

            if (!files || files.length === 0) {
                return res.status(400).json({ error: "No files uploaded" });
            }

            const createdPosts = await this._createPosts.execute({ token, files, titles });

            res.status(201).json({ message: "Posts created successfully", posts: createdPosts });

        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async getPosts(req: Request, res: Response) {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) {
                return res.status(401).json({ error: "No refresh token found" });
            }

            const posts = await this._getPosts.execute(token)

            res.status(200).json({ message: 'Images fetched successfully', posts })

        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const { imagePosition } = req.params
            const { title } = req.body
            const files = req.files as Express.Multer.File[]

            const file = files[0]; // Only one image expected
            let newImageName
            if (file) {
                newImageName = file.filename;
            }

            // Find the existing post

            const updatedPost = await this._updatePosts.execute(imagePosition, newImageName!, title)

            res.status(200).json({
                success: true,
                message: "Image updated successfully",
                post: updatedPost
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const { postId } = req.params

            if (!postId) {
                return res.status(400).json({ message: "No PostId found" })
            }

            await this._deletePosts.execute(postId)

            res.status(200).json({ message: "Post Deleted Successfully" })
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }


    async updatePosition(req: Request, res: Response) {
        try {
            const { imageOne, imageTwo } = req.body

            if (!imageOne || !imageTwo) {
                return res.status(400).json({ message: "Image Positions are not mentioned" })
            }

            await this._updatePosition.execute(imageOne, imageTwo)

            return res.status(200).json({ message: 'Position changed successfully' })

        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
        }
    }

}