import mongoose from "mongoose";

let isConnected: boolean = false;

export const connecttoDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true)

    if(isConnected) {
        console.log("Already connected to the database.")
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "")
        isConnected = true;
        console.log("Connected to the database.")
    }
    catch(err) {
        console.log(err)
    }
}