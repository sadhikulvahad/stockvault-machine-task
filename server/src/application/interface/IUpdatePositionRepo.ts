import { PostDTO } from "../dto";


export interface IUpdatePositionRepo {
    execute(positionOneId: string, positionTwoId: string): Promise<void>
}