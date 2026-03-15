import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById
} from "../controllers/order_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";

const orderRouter = express.Router();

// Tất cả routes đều cần đăng nhập
orderRouter.use(checkPermission);

// Tạo đơn hàng
orderRouter.post("/", createOrder);

// Lấy danh sách đơn hàng của user
orderRouter.get("/", getUserOrders);

// Lấy chi tiết một đơn hàng
orderRouter.get("/:id", getOrderById);

export default orderRouter;
