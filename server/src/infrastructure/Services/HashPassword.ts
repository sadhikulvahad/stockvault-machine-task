import bcrypt from 'bcrypt';

export class HashPassword {
    async hash(password: string): Promise<string> {
        if (!password) {
            throw new Error("Password is required");
        }

        return await bcrypt.hash(password, 11);
    }
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        if (!password || !hashedPassword) {
            throw new Error("Password and hashed password are required");
        }
        return await bcrypt.compare(password, hashedPassword);
    }

}   