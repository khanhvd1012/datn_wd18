import { Router } from "express";
import { login, register, getMe, forgotPassword, resetPassword, updateMe, changePassword } from "../controllers/auth_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkPermission, getMe);
router.patch("/me/update", checkPermission, updateMe);
router.put("/me/change-password", checkPermission, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
