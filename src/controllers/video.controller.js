import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynHandler } from "../../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const uploadVideo = asynHandler(async (req, res) => {
    const {
        videofile,
        thumbnail,
        title,
        description,
        duration,
        view,
        isPublished
    } = req.body;
    await Video.create({
        videofile,
        thumbnail,
        owner: req.user?._id,
        title,
        description,
        duration,
        view,
        isPublished
    })
    return res
        .status(200)
        .json(new ApiResponse(200,
            "Video added Successfully",
        ))
});

export { uploadVideo }