import { PostDTO } from "../dto";


export interface IUpdatePostRepo {
    execute(position: string, newImageName: string, title: string) : Promise<PostDTO | null>
}