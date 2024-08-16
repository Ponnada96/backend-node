import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynHandler } from "../../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.models.js";

const addSubscription = asynHandler(async (req, res) => {
    const { channelId } = req.body;
    if (!channelId) {
        throw new ApiError("Channel is required", 400);
    };
    const channel = await User.findOne({ _id: channelId });


    if (!channel) {
        throw new ApiError("Channel not found", 400);
    }

    const isAlreadySubscribed =await  Subscription.findOne({

        subscriber: req.user._id,
        channel: channelId
    });

    if (isAlreadySubscribed) {
        throw new ApiError("Already Subscribed!", 400);
    }

    await Subscription.create({
        subscriber: req.user?._id,
        channel: channel?._id
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Subscribed!"
        ))

});

export { addSubscription }
