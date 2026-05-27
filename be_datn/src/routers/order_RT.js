import express from "express";

import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrder,
    cancelOrder,
    confirmOrderReceived,
    deleteOrder,
    requestReturnOrder,
    approveReturn,
    rejectReturn
} from "../controllers/order_CTL.js";

import {
    checkPermission,
    checkRole
} from "../middleware/checkPermission.js";

import { ROLES } from "../config/roles.js";
import upload from "../middleware/upload_MID.js";

const orderRouter = express.Router();

// Tất cả routes đều cần đăng nhập
orderRouter.use(checkPermission);

// ================= ORDER =================

// Tạo đơn hàng
orderRouter.post("/", createOrder);

// Admin lấy tất cả đơn hàng
orderRouter.get(
    "/admin/all",
    checkRole([ROLES.ADMIN]),
    getAllOrders
);

// User lấy đơn của mình
orderRouter.get("/", getUserOrders);

// Lấy chi tiết đơn hàng
orderRouter.get("/:id", getOrderById);

// Admin cập nhật trạng thái
orderRouter.put(
    "/:id",
    checkRole([ROLES.ADMIN]),
    upload.array("delivery_proofs", 5),
    updateOrder
);

// Hủy đơn
orderRouter.patch(
    "/:id/cancel",
    cancelOrder
);

// User xác nhận đã nhận hàng
orderRouter.patch(
    "/:id/confirm-received",
    confirmOrderReceived
);

// Xóa đơn
orderRouter.delete(
    "/:id",
    checkRole([ROLES.ADMIN]),
    deleteOrder
);

// ================= RETURN =================

// User gửi yêu cầu hoàn hàng
orderRouter.post(
    "/:id/return",
    requestReturnOrder
);

// Admin duyệt hoàn
orderRouter.put(
    "/:id/approve-return",
    checkRole([ROLES.ADMIN]),
    approveReturn
);

// Admin từ chối hoàn
orderRouter.put(
    "/:id/reject-return",
    checkRole([ROLES.ADMIN]),
    rejectReturn
);

export default orderRouter;