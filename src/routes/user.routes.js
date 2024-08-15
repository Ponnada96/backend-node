import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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

export default router;