import { Router } from "express";
import { login, register, getMe, forgotPassword, resetPassword } from "../controllers/auth_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkPermission, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
