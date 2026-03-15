import express from "express";
import {
    createVNPayPayment,
    handleVNPayCallback,
    processMockPayment,
    updatePaymentStatus,
    getPaymentInfo
} from "../controllers/payment_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";

const paymentRouter = express.Router();

// Public route - VNPay callback không cần auth (phải đặt trước checkPermission)
paymentRouter.get("/vnpay/callback", handleVNPayCallback);

// Public route - Lấy thông tin thanh toán
paymentRouter.get("/info", getPaymentInfo);

// Protected routes - Cần đăng nhập
paymentRouter.use(checkPermission);

// Tạo payment URL cho VNPay
paymentRouter.post("/vnpay/create", createVNPayPayment);

// Mock payment (để test - simulate thanh toán thành công)
paymentRouter.post("/mock/process", processMockPayment);

// Cập nhật trạng thái thanh toán (cho bank transfer)
paymentRouter.put("/status/:orderId", updatePaymentStatus);

export default paymentRouter;
