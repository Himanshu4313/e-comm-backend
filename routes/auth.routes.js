import { Router } from "express";
import { forgotPassword, resetPassword, signin, signout, signup, verifyOTP } from "../controllers/auth.controllers.js";
import { authTokenCheck } from "../middleware/auth.mw.js";
const router = Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/signout",authTokenCheck,signout);
router.post("/forgot-password",forgotPassword);
router.post("/verify-otp",verifyOTP);
router.post("/reset-password",resetPassword);

export default router;