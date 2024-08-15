import { asynHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const registerUser = asynHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;
    const fields = { username, email, fullname, password };

    debugger
    const errors = Object.keys(fields)
        .filter(key => !fields[key]?.trim())
        .map(key => `${key} is Required`)
    if (errors.length) {
        throw new ApiError("Filed are missing", 400, errors);
    }
    const isUserAlreadyExists = await User.findOne({
        $or: [{ username }, { email }]
    });
    console.log(isUserAlreadyExists);
    if (isUserAlreadyExists) {
        throw new ApiError("User Alredy Exists", 400);
    }
    debugger
    const avatarPath = req.files?.avatar[0]?.path;
    if (!avatarPath) {
        throw new ApiError("Avatar is required", 400);
    }

    const [avatar, coverImage] = await Promise.all([
        uploadOnCloudinary(avatarPath),
        uploadOnCloudinary(req.files?.coverImage?.[0] ?
            req.files.coverImage[0].path : null)
    ]);

    if (!avatar) {
        throw new ApiError("Avatar file is required!", 400);
    }

    const newUser = await User.create({
        username,
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError("Something went wrong while creating user"
            , 500);
    }

    res.status(201).json(
        new ApiResponse(
            200,
            "User has been created successfullt",
            createdUser
        )
    )
})

export { registerUser }