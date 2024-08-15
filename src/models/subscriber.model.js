import mongoose, { Schema } from "mongoose";

const subscriberSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,// Ref to the Subscribed user
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,// Ref to the User's channel subscribed.
        ref: "User"
    },
})

export const subscriber = mongoose.model(subscriberSchema);