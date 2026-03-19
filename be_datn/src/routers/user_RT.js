import { Router } from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/user_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";
import { ROLES } from "../config/roles.js";

const router = Router();

router.get("/", checkPermission, checkRole([ROLES.ADMIN]), getAllUsers);
router.patch("/:id/role", checkPermission, checkRole([ROLES.ADMIN]), updateUserRole);
router.delete("/:id", checkPermission, checkRole([ROLES.ADMIN]), deleteUser);

export default router;
