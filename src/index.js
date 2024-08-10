
import dotenv from "dotenv"
import exppress from 'express';
import  connectDB  from './db/index.js'
const app = exppress();

dotenv.config({
    path: './env'
})
connectDB();

/*
; (async () => {

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error', (error) => {
            console.log("ERR:", error);
            throw error
        });
        app.listen(process.env.PORT, () => {
            console.log(`Listening on Port${process.env.PORT}`)
        });
    }
    catch (error) {
        console.error("ERROR", error);
        throw error
    }
})()
*/