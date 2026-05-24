import express from "express";

import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrder,
    cancelOrder,
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
    updateOrder
);

// Hủy đơn
orderRouter.patch(
    "/:id/cancel",
    cancelOrder
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