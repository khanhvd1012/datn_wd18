import Order from "../models/order_MD.js";
import crypto from "node:crypto";

// Tạo payment URL cho VNPay
export const createVNPayPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user._id;

        // Kiểm tra đơn hàng thuộc về user
        const order = await Order.findOne({ 
            _id: orderId, 
            user_id: userId 
        });

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        if (order.payment_status === "paid") {
            return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });
        }

        // Tạo payment URL (VNPay integration)
        // Trong thực tế, bạn cần tích hợp với VNPay API
        // Ở đây tôi sẽ tạo một mock payment URL hoặc real VNPay URL
        
        const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
        
        // Kiểm tra nếu chưa có thông tin VNPay, trả về lỗi hoặc redirect đến mock payment
        if (!vnp_TmnCode || !vnp_HashSecret || vnp_TmnCode === "YOUR_TMN_CODE" || vnp_HashSecret === "YOUR_HASH_SECRET") {
            return res.status(400).json({ 
                message: "VNPay chưa được cấu hình. Vui lòng sử dụng mock payment để test.",
                useMock: true,
                orderId: order._id
            });
        }
        
        const vnp_Url = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const vnp_ReturnUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/callback`;

        const vnp_TxnRef = order._id.toString();
        const vnp_OrderInfo = `Thanh toan don hang ${vnp_TxnRef}`;
        const vnp_OrderType = "other";
        const vnp_Amount = order.total * 100; // VNPay yêu cầu số tiền nhân 100
        const vnp_Locale = "vn";
        const vnp_IpAddr = req.ip || req.connection.remoteAddress || "127.0.0.1";

        const date = new Date();
        const createDate = date.toISOString().replace(/[-:]/g, "").split(".")[0];
        const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
            .toISOString()
            .replace(/[-:]/g, "")
            .split(".")[0];

        const vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode,
            vnp_Locale,
            vnp_CurrCode: "VND",
            vnp_TxnRef,
            vnp_OrderInfo,
            vnp_OrderType,
            vnp_Amount,
            vnp_ReturnUrl,
            vnp_IpAddr,
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate
        };

        // Sắp xếp params và tạo query string
        const sortedParams = Object.keys(vnp_Params)
            .sort()
            .reduce((acc, key) => {
                acc[key] = vnp_Params[key];
                return acc;
            }, {});

        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(signData).digest("hex");
        sortedParams.vnp_SecureHash = signed;

        const paymentUrl = `${vnp_Url}?${new URLSearchParams(sortedParams).toString()}`;

        res.status(200).json({
            message: "Tạo payment URL thành công",
            paymentUrl,
            orderId: order._id
        });

    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xử lý callback từ VNPay
export const handleVNPayCallback = async (req, res) => {
    try {
        const vnp_Params = req.query;
        const secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET || "YOUR_HASH_SECRET";
        const signData = new URLSearchParams(
            Object.keys(vnp_Params)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = vnp_Params[key];
                    return acc;
                }, {})
        ).toString();

        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(signData).digest("hex");

        if (secureHash === signed) {
            const orderId = vnp_Params.vnp_TxnRef;
            const responseCode = vnp_Params.vnp_ResponseCode;

            if (responseCode === "00") {
                // Thanh toán thành công
                await Order.findByIdAndUpdate(orderId, {
                    payment_status: "paid",
                    order_status: "confirmed"
                });

                res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/success?orderId=${orderId}`);
            } else {
                // Thanh toán thất bại
                await Order.findByIdAndUpdate(orderId, {
                    payment_status: "failed"
                });

                res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/failed?orderId=${orderId}`);
            }
        } else {
            res.status(400).json({ message: "Chữ ký không hợp lệ" });
        }
    } catch (error) {
        console.error("Error handling VNPay callback:", error);
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Mock payment (để test - simulate thanh toán thành công)
export const processMockPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user._id;

        const order = await Order.findOne({ 
            _id: orderId, 
            user_id: userId 
        });

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        if (order.payment_status === "paid") {
            return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });
        }

        // Simulate successful payment
        await Order.findByIdAndUpdate(orderId, {
            payment_status: "paid",
            order_status: "confirmed"
        });

        res.status(200).json({
            message: "Thanh toán thành công",
            order: await Order.findById(orderId)
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Cập nhật trạng thái thanh toán (cho bank transfer - admin xác nhận)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { payment_status } = req.body;
        const userId = req.user._id;

        const order = await Order.findOne({ 
            _id: orderId, 
            user_id: userId 
        });

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        // Chỉ cho phép cập nhật từ pending sang paid (cho bank transfer)
        if (order.payment_method === "bank" && payment_status === "paid") {
            await Order.findByIdAndUpdate(orderId, {
                payment_status: "paid",
                order_status: "confirmed"
            });

            return res.status(200).json({
                message: "Cập nhật trạng thái thanh toán thành công",
                order: await Order.findById(orderId)
            });
        }

        res.status(400).json({ message: "Không thể cập nhật trạng thái thanh toán" });

    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy thông tin thanh toán (bank account info)
export const getPaymentInfo = async (req, res) => {
    try {
        res.status(200).json({
            message: "Lấy thông tin thanh toán thành công",
            bankInfo: {
                bankName: "Ngân hàng ABC",
                accountNumber: "1234567890",
                accountName: "CÔNG TY CỔ PHẦN KỸ NGHỆ VÀ THƯƠNG MẠI NHẬT MINH",
                branch: "Chi nhánh Hà Nội",
                content: "Thanh toan don hang" // Nội dung chuyển khoản
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};
