import { Router } from "express"
import {
    loginUser,
    logoutUser,
    registerUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateJwt } from "../middlewares/auth.middleware.js";
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

//Secured Routes
router.route("/logout").post(validateJwt, logoutUser);

export default router;