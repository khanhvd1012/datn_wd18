import mongoose from "mongoose";
import Order from "../models/order_MD.js";
import Cart from "../models/cart_MD.js";
import CartItem from "../models/cartItem_MD.js";
import Product from "../models/product_MD.js";
import Variant from "../models/variant_MD.js";
import Voucher from "../models/voucher_MD.js";
import { createOrderValidator } from "../validators/order_VLD.js";
import { ROLES } from "../config/roles.js";

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
        const { shipping_info, payment_method, coupon_code, notes } = req.body;

        // 1. Lấy giỏ hàng của user
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng trống" });
        }

        // 2. Lấy tất cả items trong giỏ hàng
        const cartItems = await CartItem.find({
            cart_id: cart._id,
            deletedAt: null
        })
        .populate({
            path: "product_id",
            select: "name price images countInStock"
        })
        .populate({
            path: "variant_id",
            select: "name price stock",
            options: { lean: false } // Đảm bảo populate đúng cách
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống" });
        }

        // 3. Kiểm tra tồn kho và tính toán giá
        const orderItems = [];
        let subtotal = 0;

        for (const item of cartItems) {
            const product = item.product_id;
            if (!product) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại" });
            }

            let price = item.price || product.price || 0; // Ưu tiên price từ cart item đã lưu
            let stock = product.countInStock || 0;
            let variantName = "";
            let variantId = null;

            // Nếu có variant_id (đã được populate hoặc vẫn là ID)
            if (item.variant_id) {
                const variant = item.variant_id;
                
                // Trường hợp đã populate thành công
                if (variant._id) {
                    variantId = variant._id;
                    variantName = variant.name || "";
                    
                    if (variant.price !== undefined && variant.price !== null) {
                        price = variant.price;
                    }
                    
                    if (variant.stock !== undefined && variant.stock !== null && variant.stock > 0) {
                        stock = variant.stock;
                    }
                } else {
                    // Nếu chưa populate (do lỗi ref hoặc lý do khác), 
                    // ta có thể tin tưởng vào price đã lưu ở CartItem
                    variantId = variant;
                    price = item.price || product.price || 0;
                }
            }

            // Kiểm tra tồn kho
            if (stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Sản phẩm "${product.name}"${variantName ? ` - ${variantName}` : ""} chỉ còn ${stock} sản phẩm trong kho` 
                });
            }

            // Tạo order item
            const orderItem = {
                product_id: product._id,
                variant_id: variantId || null,
                name: `${product.name}${variantName ? ` - ${variantName}` : ""}`,
                price: price,
                quantity: item.quantity,
                image: product.images && product.images.length > 0 ? product.images[0] : ""
            };

            orderItems.push(orderItem);
            subtotal += price * item.quantity;
        }

        // 4. Tính phí ship (miễn phí nếu > 500k)
        const shippingFee = subtotal > 500000 ? 0 : 30000;

        // 5. Tính discount (10% nếu > 1 triệu)
        const discount = subtotal > 1000000 ? subtotal * 0.1 : 0;

        // 6. Validate và tính coupon discount ừ ngày Voucher DB
        let couponDiscount = 0;
        let appliedVoucher = null;

        if (coupon_code) {
            const now = new Date();
            const voucher = await Voucher.findOne({
                code: coupon_code.toUpperCase(),
                status: 'active',
                start_date: { $lte: now },
                end_date:   { $gte: now }
            });

            if (!voucher) {
                return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
            }
            if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) {
                return res.status(400).json({ message: "Mã giảm giá đã hết lượt sử dụng" });
            }
            if (voucher.min_order_amount > 0 && subtotal < voucher.min_order_amount) {
                return res.status(400).json({
                    message: `Đơn hàng tối thiểu ${voucher.min_order_amount.toLocaleString('vi-VN')}đ mới áp dụng được mã này`
                });
            }

            // Tính giá trị giảm giá
            if (voucher.discount_type === 'percentage') {
                couponDiscount = subtotal * (voucher.discount_value / 100);
                if (voucher.max_discount_amount > 0) {
                    couponDiscount = Math.min(couponDiscount, voucher.max_discount_amount);
                }
            } else {
                couponDiscount = Math.min(voucher.discount_value, subtotal);
            }

            appliedVoucher = voucher;
        }

        // 7. Tính tổng tiền
        const total = Math.max(0, subtotal + shippingFee - discount - couponDiscount);

        // 8. Tạo đơn hàng
        const order = await Order.create({
            user_id: userId,
            order_items: orderItems,
            shipping_info,
            payment_method: payment_method || 'cod',
            subtotal,
            shipping_fee: shippingFee,
            discount,
            coupon_discount: couponDiscount,
            total,
            coupon_code: coupon_code || null,
            notes: notes || ""
        });

        // 9. Xóa giỏ hàng sau khi tạo đơn hàng thành công
        await CartItem.updateMany(
            { cart_id: cart._id },
            { deletedAt: new Date() }
        );

        // 10. Tăng used_count của voucher nếu có áp dụng
        if (appliedVoucher) {
            await Voucher.findByIdAndUpdate(appliedVoucher._id, { $inc: { used_count: 1 } });
        }

        // 10. Cập nhật stock (giảm số lượng trong kho)
        for (const item of cartItems) {
            const product = item.product_id;
            const stockToReduce = item.quantity;
            
            if (item.variant_id && item.variant_id._id) {
                const variant = item.variant_id;
                // Nếu variant có stock được set và > 0, giảm stock của variant
                if (variant.stock !== undefined && variant.stock !== null && variant.stock > 0) {
                    await Variant.findByIdAndUpdate(variant._id, {
                        $inc: { stock: -stockToReduce }
                    });
                } else {
                    // Nếu variant không có stock, giảm stock của product
                    await Product.findByIdAndUpdate(product._id, {
                        $inc: { countInStock: -stockToReduce }
                    });
                }
            } else {
                // Không có variant, giảm stock của product
                await Product.findByIdAndUpdate(product._id, {
                    $inc: { countInStock: -stockToReduce }
                });
            }
        }

        // 11. Populate để trả về thông tin đầy đủ
        const populatedOrder = await Order.findById(order._id)
            .populate("user_id", "username email")
            .populate("order_items.product_id", "name images");

        res.status(201).json({
            message: "Đặt hàng thành công",
            order: populatedOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user_id: userId })
            .populate("order_items.product_id", "name images")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Lấy danh sách đơn hàng thành công",
            orders
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy chi tiết một đơn hàng
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        let query = { _id: id };
        
        // Nếu không phải admin/employee thì chỉ được xem đơn hàng của chính mình
        if (user.role !== ROLES.ADMIN && user.role !== ROLES.EMPLOYEE) {
            query.user_id = user._id;
        }

        const order = await Order.findOne(query)
            .populate("user_id", "username email")
            .populate("order_items.product_id", "name images")
            .populate("order_items.variant_id", "name");

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        res.status(200).json({
            message: "Lấy chi tiết đơn hàng thành công",
            order
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả đơn hàng (Admin/Employee)
export const getAllOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.order_status = status;
        }

        if (search) {
            query.$or = [
                { "_id": mongoose.Types.ObjectId.isValid(search) ? search : undefined },
                { "shipping_info.name": { $regex: search, $options: "i" } },
                { "shipping_info.phone": { $regex: search, $options: "i" } },
                { "shipping_info.email": { $regex: search, $options: "i" } }
            ].filter(Boolean);
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate("user_id", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        if (orders.length > 0) {
            console.log("--- GET ALL ORDERS RESULT ---");
            console.log("Mẫu dữ liệu đơn hàng đầu tiên xuất về cho React:");
            console.log(JSON.stringify(orders[0], null, 2));
        } else {
            console.log("--- GET ALL ORDERS RESULT: Không có đơn nào ---");
        }

        res.status(200).json({
            message: "Lấy danh sách đơn hàng thành công",
            data: orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error getting all orders:", error);
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Cập nhật đơn hàng (Admin/Employee)
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        const { order_status, payment_status, shipping_info, notes } = req.body;

        console.log(`\n--- [UPDATE ORDER BEGIN] ID: ${id} ---`);
        console.log(`- Nhận order_status: ${order_status}`);
        console.log(`- Nhận payment_status: ${payment_status}`);
        console.log(`- Nhận notes: ${notes}`);

        if (order_status) updateData.order_status = order_status;
        if (payment_status) updateData.payment_status = payment_status;
        if (notes !== undefined) updateData.notes = notes;
        if (shipping_info) {
            // Cập nhật từng trường của shipping_info để tránh ghi đè toàn bộ object nếu thiếu trường
            Object.keys(shipping_info).forEach(key => {
                updateData[`shipping_info.${key}`] = shipping_info[key];
            });
            console.log(`- Có cập nhật shipping_info`);
        }

        console.log("- Dữ liệu truy vấn cập nhật:", updateData);

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("user_id", "username email");

        if (!order) {
            console.log(`[UPDATE ORDER ERROR] Không tìm thấy đơn hàng ID: ${id}`);
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        console.log(`[UPDATE ORDER SUCCESS] Đã cập nhật thành công cho ID: ${id}`);
        
        res.status(200).json({
            message: "Cập nhật đơn hàng thành công",
            order
        });
    } catch (error) {
        console.error("[UPDATE ORDER CRITICAL ERROR]:", error);
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa đơn hàng (Admin)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        res.status(200).json({
            message: "Xóa đơn hàng thành công"
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};
