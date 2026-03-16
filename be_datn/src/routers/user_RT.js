import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";

const router = Router();

// /api/users
router.get("/", checkPermission, checkRole(['admin']), getAllUsers);
router.get("/:id", checkPermission, getUserById); // Tuỳ ứng dụng, nếu profile public thì không cần
router.put("/:id", checkPermission, updateUser);
router.delete("/:id", checkPermission, checkRole(['admin']), deleteUser);

export default router;
