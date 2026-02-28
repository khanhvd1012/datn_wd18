import { Router } from "express";
import { login, register, getMe } from "../controllers/auth_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkPermission, getMe);

export default router;
