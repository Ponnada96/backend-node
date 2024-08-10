import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(`${process.env
            .MONGODB_URI}/${DB_NAME}`);
        console.log(`Connection Successfull to Host:
            ${dbConnection.connection.host}`)
    }
    catch (error) {
        console.log("Error Connect to DB", error)
        process.exit(1);
    }
};
export default connectDB;