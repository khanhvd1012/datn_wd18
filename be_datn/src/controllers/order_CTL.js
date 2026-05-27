import mongoose from "mongoose";
import Order from "../models/order_MD.js";
import Cart from "../models/cart_MD.js";
import CartItem from "../models/cartItem_MD.js";
import Product from "../models/product_MD.js";
import Variant from "../models/variant_MD.js";
import Voucher from "../models/voucher_MD.js";
import { createOrderValidator } from "../validators/order_VLD.js";
import { ROLES } from "../config/roles.js";
import { deductOrderStock, restoreOrderStock } from "../utils/orderStockUtils.js";

const ONLINE_PAYMENT_METHODS = ["vnpay", "momo", "bank"];
const DELIVERY_CONFIRM_WINDOW_DAYS = 3;

const ALLOWED_TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipping", "cancelled"],
    shipping: ["delivered", "cancelled"],
    delivered: ["received"],
    received: [],
    cancelled: []
};

const canTransition = (fromStatus, toStatus, isAdmin) => {
    const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];

    if (!allowed.includes(toStatus)) return false;

    if (
        toStatus === "cancelled" &&
        fromStatus === "shipping" &&
        !isAdmin
    ) {
        return false;
    }

    return true;
};

const performAutoConfirmOverdueOrders = async () => {
    const now = new Date();

    await Order.updateMany(
        {
            order_status: "delivered",
            customer_confirmed_received: false,
            confirmation_deadline_at: { $ne: null, $lte: now }
        },
        {
            $set: {
                order_status: "received",
                customer_confirmed_received: true,
                confirmed_received_at: now,
                confirmed_received_by: "auto"
            }
        }
    );
};

// ================= REQUEST RETURN =================

export const requestReturnOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const user = req.user;

        let query = { _id: id };

        // User chỉ được trả đơn của mình
        if (user.role !== ROLES.ADMIN) {
            query.user_id = user._id;
        }

        const order = await Order.findOne(query);

        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }

        // Chỉ cho trả hàng khi đã giao
        if (order.order_status !== "received") {
            return res.status(400).json({
                message: "Chỉ được yêu cầu trả hàng sau khi đã xác nhận nhận hàng"
            });
        }

        // Không gửi nhiều lần
        if (order.return_status !== "none") {
            return res.status(400).json({
                message: "Đơn hàng đã gửi yêu cầu trả hàng"
            });
        }

        order.return_status = "requested";

        await order.save();

        res.status(200).json({
            message: "Yêu cầu trả hàng thành công",
            order
        });

    } catch (error) {

        console.error("REQUEST RETURN ERROR:", error);

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });

    }
};

// ================= CREATE ORDER =================

// Tạo đơn hàng từ giỏ hàng
export const createOrder = async (req, res) => {
    try {

        const { error } = createOrderValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const userId = req.user._id;

        const {
            shipping_info,
            payment_method,
            coupon_code,
            notes,
            selectedCartItemIds
        } = req.body;

        // 1. Lấy giỏ hàng của user
        const cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Giỏ hàng trống"
            });
        }

        // 2. Lấy tất cả items trong giỏ hàng
        let queryCartItems = {
            cart_id: cart._id,
            deletedAt: null
        };

        if (
            selectedCartItemIds &&
            selectedCartItemIds.length > 0
        ) {
            queryCartItems._id = {
                $in: selectedCartItemIds
            };
        }

        const cartItems = await CartItem.find(queryCartItems)
            .populate({
                path: "product_id",
                select: "name price images countInStock"
            })
            .populate({
                path: "variant_id",
                select: "name price stock",
                options: { lean: false }
            });

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Giỏ hàng trống"
            });
        }

        // 3. Kiểm tra tồn kho và tính toán giá
        const orderItems = [];

        let subtotal = 0;

        for (const item of cartItems) {

            const product = item.product_id;

            if (!product) {
                return res.status(404).json({
                    message: "Sản phẩm không tồn tại"
                });
            }

            let price = item.price || product.price || 0;

            let stock = product.countInStock || 0;

            let variantName = "";

            let variantId = null;

            // Variant
            if (item.variant_id) {

                const variant = item.variant_id;

                if (variant._id) {

                    variantId = variant._id;

                    variantName = variant.name || "";

                    if (
                        variant.price !== undefined &&
                        variant.price !== null
                    ) {
                        price = variant.price;
                    }

                    if (
                        variant.stock !== undefined &&
                        variant.stock !== null &&
                        variant.stock > 0
                    ) {
                        stock = variant.stock;
                    }

                } else {

                    variantId = variant;

                    price = item.price || product.price || 0;
                }
            }

            // Check stock
            if (stock < item.quantity) {

                return res.status(400).json({
                    message:
                        `Sản phẩm "${product.name}"` +
                        `${variantName ? ` - ${variantName}` : ""}` +
                        ` chỉ còn ${stock} sản phẩm trong kho`
                });
            }

            const orderItem = {
                product_id: product._id,
                variant_id: variantId || null,
                name:
                    `${product.name}` +
                    `${variantName ? ` - ${variantName}` : ""}`,
                price,
                quantity: item.quantity,
                image:
                    product.images &&
                    product.images.length > 0
                        ? product.images[0]
                        : ""
            };

            orderItems.push(orderItem);

            subtotal += price * item.quantity;
        }

        // 4. Ship
        const shippingFee =
            subtotal > 500000 ? 0 : 30000;

        // 5. Discount
        const discount =
            subtotal > 1000000
                ? subtotal * 0.1
                : 0;

        // 6. Voucher
        let couponDiscount = 0;

        let appliedVoucher = null;

        if (coupon_code) {

            const now = new Date();

            const voucher = await Voucher.findOne({
                code: coupon_code.toUpperCase(),
                status: "active",
                start_date: { $lte: now },
                end_date: { $gte: now }
            });

            if (!voucher) {
                return res.status(400).json({
                    message:
                        "Mã giảm giá không hợp lệ hoặc đã hết hạn"
                });
            }

            if (
                voucher.usage_limit > 0 &&
                voucher.used_count >= voucher.usage_limit
            ) {
                return res.status(400).json({
                    message:
                        "Mã giảm giá đã hết lượt sử dụng"
                });
            }

            if (
                voucher.min_order_amount > 0 &&
                subtotal < voucher.min_order_amount
            ) {
                return res.status(400).json({
                    message:
                        `Đơn hàng tối thiểu ` +
                        `${voucher.min_order_amount.toLocaleString("vi-VN")}đ`
                });
            }

            if (
                voucher.discount_type === "percentage"
            ) {

                couponDiscount =
                    subtotal *
                    (voucher.discount_value / 100);

                if (
                    voucher.max_discount_amount > 0
                ) {
                    couponDiscount = Math.min(
                        couponDiscount,
                        voucher.max_discount_amount
                    );
                }

            } else {

                couponDiscount = Math.min(
                    voucher.discount_value,
                    subtotal
                );
            }

            appliedVoucher = voucher;
        }

        // 7. Total
        const total = Math.max(
            0,
            subtotal +
                shippingFee -
                discount -
                couponDiscount
        );

        // 8. Create order
        const order = await Order.create({
            user_id: userId,
            order_items: orderItems,
            shipping_info,
            payment_method:
                payment_method || "cod",
            subtotal,
            shipping_fee: shippingFee,
            discount,
            coupon_discount: couponDiscount,
            total,
            coupon_code: coupon_code || null,
            notes: notes || ""
        });

        // 9. Soft delete cart item
        const itemIdsToDelete = cartItems.map(
            item => item._id
        );

        await CartItem.updateMany(
            {
                _id: {
                    $in: itemIdsToDelete
                }
            },
            {
                deletedAt: new Date()
            }
        );

        // 10. Voucher count
        if (appliedVoucher) {

            await Voucher.findByIdAndUpdate(
                appliedVoucher._id,
                {
                    $inc: {
                        used_count: 1
                    }
                }
            );
        }

        // 11. Deduct stock
        try {

            await deductOrderStock(order);

        } catch (stockErr) {

            console.error(
                "Lỗi khi trừ kho:",
                stockErr
            );
        }

        // 12. Populate
        const populatedOrder =
            await Order.findById(order._id)
                .populate(
                    "user_id",
                    "username email"
                )
                .populate(
                    "order_items.product_id",
                    "name images"
                );

        res.status(201).json({
            message: "Đặt hàng thành công",
            order: populatedOrder
        });

    } catch (error) {

        console.error(
            "Error creating order:",
            error
        );

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};
// ================= GET USER ORDERS =================

export const getUserOrders = async (req, res) => {
    try {
        await performAutoConfirmOverdueOrders();

        const userId = req.user._id;

        const orders = await Order.find({
            user_id: userId
        })
            .populate(
                "order_items.product_id",
                "name images"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                "Lấy danh sách đơn hàng thành công",
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// ================= GET ORDER DETAIL =================

export const getOrderById = async (req, res) => {
    try {
        await performAutoConfirmOverdueOrders();

        const { id } = req.params;

        const user = req.user;

        let query = {
            _id: id
        };

        if (user.role !== ROLES.ADMIN) {
            query.user_id = user._id;
        }

        const order = await Order.findOne(query)
            .populate(
                "user_id",
                "username email"
            )
            .populate(
                "order_items.product_id",
                "name images"
            )
            .populate(
                "order_items.variant_id",
                "name"
            );

        if (!order) {
            return res.status(404).json({
                message:
                    "Đơn hàng không tồn tại"
            });
        }

        res.status(200).json({
            message:
                "Lấy chi tiết đơn hàng thành công",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// ================= GET ALL ORDERS =================

export const getAllOrders = async (req, res) => {
    try {
        await performAutoConfirmOverdueOrders();

        const orders = await Order.find()
            .populate(
                "user_id",
                "username email"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                "Lấy tất cả đơn hàng thành công",
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// ================= UPDATE ORDER =================

export const updateOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            order_status,
            payment_status,
            shipping_info,
            notes,
            cancel_reason
        } = req.body;

        const isAdmin =
            req.user.role === ROLES.ADMIN;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message:
                    "Đơn hàng không tồn tại"
            });
        }

        const updateData = {};
        const uploadedProofs = Array.isArray(req.files)
            ? req.files.map((file) => `uploads/${file.filename}`)
            : [];

        if (
            order_status &&
            order_status !== order.order_status
        ) {

            if (
                !canTransition(
                    order.order_status,
                    order_status,
                    isAdmin
                )
            ) {
                return res.status(400).json({
                    message:
                        `Không thể chuyển từ ` +
                        `"${order.order_status}" ` +
                        `sang "${order_status}"`
                });
            }

            if (order_status === "cancelled") {

                await restoreOrderStock(order);

                updateData.cancel_reason =
                    cancel_reason ||
                    "Đơn hàng bị hủy";
            }

            if (
                order.order_status === "shipping" &&
                order_status === "delivered"
            ) {
                if (!uploadedProofs.length) {
                    return res.status(400).json({
                        message: "Vui lòng upload ảnh minh chứng khi xác nhận giao hàng thành công"
                    });
                }

                updateData.delivery_proof_images = uploadedProofs;
                updateData.delivered_at = new Date();
                const confirmationDeadline = new Date();
                confirmationDeadline.setDate(
                    confirmationDeadline.getDate() + DELIVERY_CONFIRM_WINDOW_DAYS
                );
                updateData.confirmation_deadline_at = confirmationDeadline;
                updateData.customer_confirmed_received = false;
                updateData.confirmed_received_at = null;
                updateData.confirmed_received_by = null;
                updateData.delivery_rating = null;
                updateData.delivery_feedback = "";

                // COD được xem là đã thu tiền khi giao thành công
                if (order.payment_method === "cod" && order.payment_status !== "paid") {
                    updateData.payment_status = "paid";
                }
            }

            updateData.order_status =
                order_status;
        }

        if (payment_status) {
            updateData.payment_status =
                payment_status;
        }

        if (notes !== undefined) {
            updateData.notes = notes;
        }

        if (shipping_info) {

            Object.keys(shipping_info)
                .forEach(key => {

                    updateData[
                        `shipping_info.${key}`
                    ] = shipping_info[key];
                });
        }

        const updatedOrder =
            await Order.findByIdAndUpdate(
                id,
                {
                    $set: updateData
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        res.status(200).json({
            message:
                "Cập nhật đơn hàng thành công",
            order: updatedOrder
        });

    } catch (error) {

        console.error(
            "UPDATE ORDER ERROR:",
            error
        );

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// ================= CANCEL ORDER =================

export const cancelOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const { cancel_reason } = req.body;

        const user = req.user;

        const isAdmin =
            user.role === ROLES.ADMIN;

        let query = {
            _id: id
        };

        if (!isAdmin) {
            query.user_id = user._id;
        }

        const order = await Order.findOne(query);

        if (!order) {
            return res.status(404).json({
                message:
                    "Đơn hàng không tồn tại"
            });
        }

        if (order.order_status === "cancelled") {
            return res.status(400).json({
                message:
                    "Đơn hàng đã bị hủy"
            });
        }

        if (order.order_status === "delivered") {
            return res.status(400).json({
                message:
                    "Đơn hàng đã giao, không thể hủy"
            });
        }

        await restoreOrderStock(order);

        order.order_status = "cancelled";

        order.cancel_reason =
            cancel_reason ||
            "Khách hàng hủy";

        await order.save();

        res.status(200).json({
            message:
                "Hủy đơn hàng thành công",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// ================= CONFIRM RECEIVED BY USER =================
export const confirmOrderReceived = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const { delivery_rating, delivery_feedback } = req.body || {};

        const order = await Order.findOne({
            _id: id,
            user_id: user._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }

        if (order.order_status === "received") {
            return res.status(200).json({
                message: "Đơn hàng đã được xác nhận trước đó",
                order
            });
        }

        if (order.order_status !== "delivered") {
            return res.status(400).json({
                message: "Chỉ xác nhận nhận hàng khi đơn ở trạng thái đã giao"
            });
        }

        order.order_status = "received";
        order.customer_confirmed_received = true;
        order.confirmed_received_at = new Date();
        order.confirmed_received_by = "user";
        if (delivery_rating !== undefined) {
            const parsedRating = Number(delivery_rating);
            if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                return res.status(400).json({
                    message: "Đánh giá giao hàng phải từ 1 đến 5 sao"
                });
            }
            order.delivery_rating = parsedRating;
        }
        if (typeof delivery_feedback === "string") {
            order.delivery_feedback = delivery_feedback.trim();
        }
        await order.save();

        res.status(200).json({
            message: "Xác nhận đã nhận hàng thành công",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// ================= DELETE ORDER =================

export const deleteOrder = async (req, res) => {

    return res.status(403).json({
        message:
            "Không được phép xóa đơn hàng"
    });
};
export const approveReturn = async (
  req,
  res
) => {

  const order = await Order.findById(
    req.params.id
  );

  if (!order) {
    return res.status(404).json({
      message: "Không tìm thấy đơn"
    });
  }

  order.return_status = "approved";

  await order.save();

  res.json({
    message: "Đã duyệt hoàn hàng",
    order
  });
};

export const rejectReturn = async (
  req,
  res
) => {

  const order = await Order.findById(
    req.params.id
  );

  if (!order) {
    return res.status(404).json({
      message: "Không tìm thấy đơn"
    });
  }

  order.return_status = "rejected";

  await order.save();

  res.json({
    message: "Đã từ chối hoàn hàng",
    order
  });
};
