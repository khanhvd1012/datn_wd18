import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrder,
    cancelOrder,
    deleteOrder
} from "../controllers/order_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";
import { ROLES } from "../config/roles.js";

const orderRouter = express.Router();

// Tất cả routes đều cần đăng nhập
orderRouter.use(checkPermission);

// Tạo đơn hàng
orderRouter.post("/", createOrder);

// Lấy danh sách tất cả đơn hàng (Admin)
orderRouter.get("/admin/all", checkRole([ROLES.ADMIN]), getAllOrders);

// Lấy danh sách đơn hàng của user
orderRouter.get("/", getUserOrders);

// Cập nhật trạng thái đơn hàng (Admin)
orderRouter.put("/:id", checkRole([ROLES.ADMIN]), updateOrder);

// Hủy đơn hàng (User hoặc Admin)
orderRouter.patch("/:id/cancel", cancelOrder);

// Không cho phép xóa đơn hàng
orderRouter.delete("/:id", checkRole([ROLES.ADMIN]), deleteOrder);

// Lấy chi tiết một đơn hàng
orderRouter.get("/:id", getOrderById);

export default orderRouter;
