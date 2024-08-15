import { asynHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const getUserAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
}

const registerUser = asynHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;
    const fields = { username, email, fullname, password };

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

    return res.status(201).json(
        new ApiResponse(
            200,
            "User has been created successfullt",
            createdUser)
    )
})

const loginUser = asynHandler(async (req, res) => {

    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new ApiError("Username or Email is Required", 400);
    }
    if (!password) {
        throw new ApiError("Password is Required", 400);
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (!user) {
        throw new ApiError("User not found", 400);
    }
    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
        throw new ApiError("Password is not correct", 401);
    }
    const { accessToken, refreshToken } = await
        getUserAccessTokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }))
});

const logoutUser = asynHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User Logout Successfull", {}))
})

const refreshAccessToken = asynHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken
            || req.body?.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError("Unauthorized access", 401);
        }
        const decodedToken = jwt.verify(incomingRefreshToken,
            process.env.REFRESHTOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError("Invalid refesh token", 401);
        }

        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError("Invalid refesh token", 401);
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(`Refresh token is
                 expired or used`, 401);
        }
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            getUserAccessTokenAndRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200,
                "AccessToken Refreshed",
                {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            ))
    } catch (error) {
        throw new ApiError(error?.message ||
            "Invalid refresh token",
            401)
    }
});

const changePassword = asynHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!(currentPassword || newPassword || confirmPassword)) {
        throw new ApiError(`currentPassword, newPassWord,
            confirmPassword are requied!`, 400);
    }
    if (!(newPassword === confirmPassword)) {
        throw new ApiError(`newPassWord,
            confirmPassword are not same!`, 400);
    }
    const user = await User.findById(req.user?._id);
    const isValidPassword = await
        user.isPasswordValid(currentPassword);

    if (!isValidPassword) {
        throw new ApiError('Password is not correct', 400);
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Password Updated Successfully"))
});

const getUser = asynHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "UserDetails Fetched",
            req.user
        ))
});

const updateUser = asynHandler(async (req, res) => {
    const { email, fullname } = req.body;
    if (!email && !fullname) {
        throw new ApiError("Fileds are required", 400);
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email,
                fullname
            },

        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                "User Updated Successfully!",
                user
            ))
});

const updateAvatar = asynHandler(async (req, res) => {
    const avatarPath = req.file?.path;
    if (!avatarPath) {
        throw new ApiError("Avatar file is required", 400);
    }

    const avatar = await uploadOnCloudinary(avatarPath);
    if (!avatar) {
        throw new ApiError("Error While uploading the Avatar", 400);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .body(new ApiResponse(
            200,
            "Avatar Uploaded Successfully",
            user
        ))
});

const updateCoverImage = asynHandler(async (req, res) => {
    const coverImagePath = req.file?.path;
    if (!coverImagePath) {
        throw new ApiError("Avatar file is required", 400);
    }

    const coverImage = await uploadOnCloudinary(coverImagePath);
    if (!coverImage) {
        throw new ApiError("Error While uploading the coverImage", 400);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .body(new ApiResponse(
            200,
            "coverImage Uploaded Successfully",
            user
        ))
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getUser,
    updateUser,
    updateAvatar,
    updateCoverImage
}