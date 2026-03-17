import { Router } from "express";
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../controllers/notification_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";

const router = Router();

// /api/notifications
router.get("/user/:userId", checkPermission, getUserNotifications);
router.put("/:notificationId/read", checkPermission, markAsRead);
router.put("/user/:userId/read-all", checkPermission, markAllAsRead);
router.delete("/:notificationId", checkPermission, checkRole(['admin']), deleteNotification);

export default router;
