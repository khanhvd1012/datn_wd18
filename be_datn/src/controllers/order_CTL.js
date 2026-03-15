import Order from "../models/order_MD.js";
import Cart from "../models/cart_MD.js";
import CartItem from "../models/cartItem_MD.js";
import Product from "../models/product_MD.js";
import Variant from "../models/variant_MD.js";
import { createOrderValidator } from "../validators/order_VLD.js";

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

            let price = product.price || 0;
            let stock = product.countInStock || 0;
            let variantName = "";
            let variantId = null;

            // Nếu có variant_id và variant tồn tại
            if (item.variant_id && item.variant_id._id) {
                const variant = item.variant_id;
                variantId = variant._id;
                variantName = variant.name || "";
                
                // Lấy giá từ variant nếu có
                if (variant.price !== undefined && variant.price !== null) {
                    price = variant.price;
                }
                
                // Lấy stock từ variant nếu có và > 0, nếu không thì dùng stock của product
                if (variant.stock !== undefined && variant.stock !== null && variant.stock > 0) {
                    stock = variant.stock;
                } else {
                    // Nếu variant không có stock hoặc stock = 0, dùng stock của product
                    stock = product.countInStock || 0;
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

        // 6. Tính coupon discount (nếu có)
        let couponDiscount = 0;
        // TODO: Validate và tính coupon discount từ voucher system
        if (coupon_code === "SALE10") {
            couponDiscount = subtotal * 0.1;
        }

        // 7. Tính tổng tiền
        const total = subtotal + shippingFee - discount - couponDiscount;

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
        const userId = req.user._id;

        const order = await Order.findOne({ 
            _id: id, 
            user_id: userId 
        })
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
