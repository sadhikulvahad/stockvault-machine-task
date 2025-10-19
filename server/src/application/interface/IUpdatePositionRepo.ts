import { PostDTO } from "../dto";


export interface IUpdatePositionRepo {
    execute(positionOne: number, positionTwo: number): Promise<void>
}