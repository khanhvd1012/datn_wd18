import ReturnRequest from "../models/return_MD.js";
import Order from "../models/order_MD.js";
import { restoreOrderStock } from "../utils/orderStockUtils.js";
import Variant from "../models/variant_MD.js";
import Products from "../models/product_MD.js";
// USER: tạo yêu cầu hoàn hàng
export const createReturnRequest = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            order_id,
            items,
            reason,
            images
        } = req.body;

        // tìm đơn
        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng"
            });
        }

        // kiểm tra chủ đơn
        if (order.user_id.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Không có quyền"
            });
        }

        // chỉ hoàn đơn delivered
        if (order.order_status !== "delivered") {
            return res.status(400).json({
                message: "Chỉ đơn đã giao mới được hoàn"
            });
        }

        // chỉ cho hoàn trong 7 ngày
        const deliveredDate = new Date(order.updatedAt);
        const now = new Date();

        const diffDays =
            (now - deliveredDate) / (1000 * 60 * 60 * 24);

        if (diffDays > 7) {
            return res.status(400).json({
                message: "Đã quá thời gian hoàn hàng"
            });
        }

        // check đã tạo request chưa
        const existed = await ReturnRequest.findOne({
            order_id,
            status: {
                $in: [
                    "requested",
                    "approved",
                    "received",
                    "refunded"
                ]
            }
        });

        if (existed) {
            return res.status(400).json({
                message: "Đơn đã có yêu cầu hoàn"
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Chọn sản phẩm cần hoàn"
            });
        }

        let refundAmount = 0;

        // validate item
        for (const item of items) {

            const orderItem = order.order_items.find(
                p =>
                    p.product_id.toString() ===
item.product_id.toString()
            );

            if (!orderItem) {
                return res.status(400).json({
                    message: "Sản phẩm không thuộc đơn"
                });
            }

            if (item.quantity > orderItem.quantity) {
                return res.status(400).json({
                    message: "Số lượng hoàn không hợp lệ"
                });
            }

            refundAmount +=
                orderItem.price * item.quantity;

            item.price = orderItem.price;
        }
order.return_requested = true;

order.return_status = "requested";

await order.save();
        const returnReq = await ReturnRequest.create({
            order_id,
            user_id: userId,
            items,
            reason,
            images: images || [],
            refund_amount: refundAmount
        });

        res.status(201).json({
            message: "Gửi yêu cầu hoàn hàng thành công",
            return: returnReq
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ADMIN: xem danh sách
export const getAllReturns = async (req, res) => {
    const data = await ReturnRequest.find()
        .populate("order_id user_id")
        .sort({ createdAt: -1 });

    res.json(data);
};

// ADMIN: duyệt hoàn hàng
export const approveReturn = async (req, res) => {
    try {

        const request =
            await ReturnRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Không tìm thấy yêu cầu"
            });
        }

        if (request.status !== "requested") {
            return res.status(400).json({
                message: "Yêu cầu đã xử lý"
            });
        }

        // hoàn kho từng item
        for (const item of request.items) {

            if (item.variant_id) {

                await Variant.findByIdAndUpdate(
                    item.variant_id,
                    {
                        $inc: {
                            stock: item.quantity
                        }
                    }
                );

            } else {

                await Products.findByIdAndUpdate(
                    item.product_id,
                    {
                        $inc: {
                            stock: item.quantity
                        }
                    }
                );
            }
        }
const order = await Order.findById(
    request.order_id
);

order.return_status = "refunded";

await order.save();
        request.status = "refunded";

        request.refunded_at = new Date();

        await request.save();

        res.json({
            message: "Đã hoàn hàng thành công",
            request
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};
//
export const updateReturnStatus = async (
    req,
    res
) => {

    try {

        const request =
            await ReturnRequest.findById(
                req.params.id
            );

        if (!request) {

            return res.status(404).json({
                message:
                    "Không tìm thấy yêu cầu hoàn"
            });
        }

        const { status } = req.body;

        const FLOW = [
            "requested",
            "approved",
            "received",
            "refunded",
            "completed"
        ];

        // reject xử lý riêng
        if (status === "rejected") {

            if (
                request.status !== "requested"
            ) {

                return res.status(400).json({
                    message:
                        "Chỉ có thể từ chối khi đang chờ duyệt"
                });
            }

            request.status = "rejected";

            await request.save();

            const order =
                await Order.findById(
                    request.order_id
                );

            if (order) {

                order.return_status =
                    "rejected";

                await order.save();
            }

            return res.json({
                message:
                    "Đã từ chối hoàn hàng",
                request
            });
        }

        const currentIndex =
            FLOW.indexOf(request.status);

        const nextIndex =
            FLOW.indexOf(status);

        // chỉ cho đi tới 1 bước
        if (
            nextIndex !== currentIndex + 1
        ) {

            return res.status(400).json({
                message:
                    "Không thể chuyển trạng thái nhảy cóc"
            });
        }

        // nếu tới refunded thì hoàn kho
        if (
            status === "refunded"
        ) {

            for (const item of request.items) {

                if (item.variant_id) {

                    await Variant.findByIdAndUpdate(
                        item.variant_id,
                        {
                            $inc: {
                                stock:
                                    item.quantity
                            }
                        }
                    );

                } else {

                    await Products.findByIdAndUpdate(
                        item.product_id,
                        {
                            $inc: {
                                stock:
                                    item.quantity
                            }
                        }
                    );
                }
            }

            request.refunded_at =
                new Date();
        }

        request.status = status;

        await request.save();

        const order =
            await Order.findById(
                request.order_id
            );

        if (order) {

            order.return_status =
                status;

            await order.save();
        }

        res.json({
            message:
                "Cập nhật trạng thái hoàn hàng thành công",
            request
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};
// ADMIN: từ chối
export const rejectReturn = async (req, res) => {
    const request = await ReturnRequest.findById(req.params.id);
    const order = await Order.findById(
    request.order_id
);

order.return_status = "rejected";

await order.save();
    request.status = "rejected";
    await request.save();

    res.json({ message: "Đã từ chối" });
};