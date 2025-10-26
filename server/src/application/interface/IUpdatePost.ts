import { PostDTO } from "../dto";


export interface IUpdatePostRepo {
    execute(id: string, newImageName: string, title: string) : Promise<PostDTO | null>
}