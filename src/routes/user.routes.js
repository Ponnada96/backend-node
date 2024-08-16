import { Router } from "express"
import {
    changePassword,
    getUser,
    getUserChanneInfo,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAvatar,
    updateCoverImage,
    updateUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateJwt } from "../middlewares/auth.middleware.js";
import { addSubscription } from "../controllers/subscription.controller.js";
const router = Router();

router.route("/Register").post(
    upload.fields([
        {
            name: "avatar",
        },
        {
            name: "coverImage",
        }
    ]),
    registerUser);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

//Secured Routes
router.route("/logout").post(validateJwt, logoutUser);
router.route("/changePassword").post(validateJwt, changePassword);
router.route("/getUser").post(validateJwt, getUser);
router.route("/updateUser").post(validateJwt, updateUser);

router.route("/updateAvater").post(
    validateJwt,
    upload.single("avatar"),
    updateAvatar);

router.route("/updateCoverImage").post(
    validateJwt,
    upload.single("coverImage"),
    updateCoverImage);

router.route("/subscribe").post(validateJwt,
    addSubscription);

router.route("/channelInfo/:username")
    .get(validateJwt, getUserChanneInfo);

export default router;