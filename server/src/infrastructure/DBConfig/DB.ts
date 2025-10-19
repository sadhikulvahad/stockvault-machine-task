

import mongoose from "mongoose";

const connectDB = async () : Promise<void> => {
    await mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Something wrong with Data base", err));
}

export default connectDB;