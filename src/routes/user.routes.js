import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/Register").get(registerUser);

export default router;