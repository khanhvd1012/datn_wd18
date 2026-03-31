import Order from "../models/order_MD.js";
import crypto from "node:crypto";

// Tạo payment URL cho VNPay
export const createVNPayPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, user_id: userId });
        if (!order) return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        if (order.payment_status === "paid") return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });

        const vnp_TmnCode    = process.env.VNPAY_TMN_CODE;
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
        const vnp_Url        = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const vnp_ReturnUrl  = `${process.env.BACKEND_URL || "http://localhost:3000"}/api/payment/vnpay/callback`;

        if (!vnp_TmnCode || !vnp_HashSecret) {
            return res.status(500).json({ message: "VNPay chưa được cấu hình" });
        }

        // Format ngày theo chuẩn VNPay: yyyyMMddHHmmss (giờ +7)
        const formatVNPayDate = (date) => {
            const pad = (n) => String(n).padStart(2, "0");
            const d = new Date(date.getTime() + 7 * 60 * 60 * 1000); // UTC+7
            return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
        };

        const now        = new Date();
        const createDate = formatVNPayDate(now);
        const expireDate = formatVNPayDate(new Date(now.getTime() + 15 * 60 * 1000));

        const vnp_Params = {
            vnp_Version:   "2.1.0",
            vnp_Command:   "pay",
            vnp_TmnCode,
            vnp_Locale:    "vn",
            vnp_CurrCode:  "VND",
            vnp_TxnRef:    order._id.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
            vnp_OrderType: "other",
            vnp_Amount:    order.total * 100,
            vnp_ReturnUrl,
            vnp_IpAddr:    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1",
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate,
        };

        // Sắp xếp key theo alphabet, bắt buộc theo chuẩn VNPay
        const sortedKeys = Object.keys(vnp_Params).sort();

        // Build query string thủ công (không dùng URLSearchParams để tránh encode %20 thay vì +)
        const signData = sortedKeys
            .map(k => `${k}=${encodeURIComponent(vnp_Params[k]).replace(/%20/g, "+")}`)
            .join("&");

        const hmac   = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${signed}`;

        console.log("[VNPay] createDate:", createDate);
        console.log("[VNPay] paymentUrl:", paymentUrl.substring(0, 120) + "...");

        return res.status(200).json({
            message:    "Tạo payment URL thành công",
            paymentUrl,
            orderId: order._id,
        });

    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xử lý callback từ VNPay
export const handleVNPayCallback = async (req, res) => {
    try {
        const vnp_Params = { ...req.query }; // shallow copy để không mutate req.query
        const secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
        const sortedKeys = Object.keys(vnp_Params).sort();
        const signData = sortedKeys
            .map(k => `${k}=${encodeURIComponent(vnp_Params[k]).replace(/%20/g, "+")}`)
            .join("&");

        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

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
