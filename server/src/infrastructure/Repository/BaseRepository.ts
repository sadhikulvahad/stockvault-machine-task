import { Model } from "mongoose";

// BaseRepository.ts
export class BaseRepository<T, U = T> {

    protected model: Model<any>

    constructor(model: Model<any>) {
        this.model = model;
    }


    async findAll(): Promise<T[]> {
        const docs = await this.model.find().lean<U>().exec();
        return docs as unknown as T[];
    }

    async findById(id: string): Promise<T | null> {
        const doc = await this.model.findById(id).lean<U>().exec();
        return doc ? (doc as unknown as T) : null;
    }

    async create(data: U): Promise<T> {
        const created = await this.model.create(data);
        return created as unknown as T; // will be wrapped in entity in subclass
    }

    async update(id: string, item: Partial<U>): Promise<T | null> {
        const updated = await this.model.findByIdAndUpdate(id, item, { new: true }).lean<U>().exec();
        return updated ? (updated as unknown as T) : null;
    }

    async delete(id: string): Promise<boolean> {
        await this.model.findByIdAndDelete(id).exec();
        return true;
    }

    async insertMany(data: Partial<T>[]): Promise<T[]> {
        return await this.model.insertMany(data);
    }
}
