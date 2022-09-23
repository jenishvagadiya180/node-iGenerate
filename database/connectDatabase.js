import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('connected successfully')
    } catch (error) {
        console.log('error :>> ', error);
    }
}


export default connectDatabase