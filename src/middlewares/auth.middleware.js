import { ApiError } from "../../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";
import { asynHandler } from "../../utils/asyncHandler.js";

const validateJwt = asynHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.headers("Authorization").replace("Bearer", "");

        if (!token) {
            throw new ApiError("Unauthorized user", 401)
        };

        //Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError("Invalid access token", 401);
        }

        //Get the User
        const user = await User.findById(decodedToken.id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError("Invalid access token", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(error?.message || "Invalid Access Token", 401)
    }
});

export { validateJwt }