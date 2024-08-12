import mongoose, { Schema } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const videoSchema = new Schema({
    videofile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
    },
    view: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

userSchema.plugin(aggregatePaginate);
export const Video = mongoose.model(videoSchema)