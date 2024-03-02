import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controllers.js";
import { authTokenCheck } from "../middleware/auth.mw.js";
const router = Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/signout",authTokenCheck,signout);

export default router;