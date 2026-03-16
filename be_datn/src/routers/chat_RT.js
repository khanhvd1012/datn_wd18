import { Router } from "express";
import {
    createOrGetRoom,
    getAllRooms,
    sendMessage,
    getMessagesByRoom,
} from "../controllers/chat_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";

const router = Router();

// /api/chat
router.post("/rooms", checkPermission, createOrGetRoom); // Tạo hoặc lấy phòng cho 1 user
router.get("/rooms", checkPermission, checkRole(['admin']), getAllRooms);      // Admin lấy tất cả phòng
router.post("/rooms/:roomId/messages", checkPermission, sendMessage); // Gửi tin nhắn
router.get("/rooms/:roomId/messages", checkPermission, getMessagesByRoom); // Lấy lịch sử tin nhắn trong phòng

export default router;
