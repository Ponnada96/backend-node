
import dotenv from "dotenv"
import connectDB from './db/index.js'
import { app } from "./app.js";

dotenv.config({
    path: './env'
})
connectDB().then(() => {
    app.listen(process.env.PORT || 8008, () => {
        console.log(`Server listening on Port:${process.env.PORT || 8008}`)
    })
    app.on('error', (error) => {
        console.log("ERR:", error);
        throw error
    });
}).catch((error) => {
    console.error("Error while connecting DB:", error)
})

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