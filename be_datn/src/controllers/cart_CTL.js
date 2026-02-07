import Cart from "../models/cart_MD.js";
import CartItem from "../models/cartItem_MD.js";
import Product from "../models/product_MD.js";
import { addToCartValidator, updateCartItemValidator } from "../validators/cart_VLD.js";

// Lấy giỏ hàng của user
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            cart = await Cart.create({ user_id: userId, cart_items: [] });
        }

        // Lấy chi tiết items, chỉ lấy những item chưa bị soft delete
        const cartItems = await CartItem.find({
            cart_id: cart._id,
            deletedAt: null
        }).populate("product_id", "name price images"); // Populate thông tin sản phẩm

        res.status(200).json({
            message: "Lấy giỏ hàng thành công",
            cart: {
                ...cart.toObject(),
                items: cartItems
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
    try {
        const { error } = addToCartValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { product_id, quantity, variant_id } = req.body;
        const userId = req.user._id;

        // 1. Kiểm tra sản phẩm tồn tại và lấy giá
        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        // TODO: Logic xử lý giá theo variant nếu có
        const price = product.price;

        // 2. Tìm hoặc tạo giỏ hàng
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = await Cart.create({ user_id: userId, cart_items: [] });
        }

        // 3. Kiểm tra item đã có trong giỏ chưa (check cả deletedAt để restore nếu cần hoặc tạo mới)
        // Ở đây ta tìm item chưa bị xóa
        let existingItem = await CartItem.findOne({
            cart_id: cart._id,
            product_id: product_id,
            variant_id: variant_id || null,
            deletedAt: null
        });

        if (existingItem) {
            // Nếu đã có -> Update số lượng
            existingItem.quantity += quantity;
            existingItem.price = price; // Cập nhật lại giá mới nhất nếu muốn
            await existingItem.save();
        } else {
            // Nếu chưa có -> Tạo mới
            const newItem = await CartItem.create({
                cart_id: cart._id,
                product_id: product_id,
                variant_id: variant_id || null,
                quantity: quantity,
                price: price
            });
            // Update reference trong Cart (nếu cần thiết, tuỳ schema Cart)
            await Cart.findByIdAndUpdate(cart._id, {
                $push: { cart_items: newItem._id }
            });
        }

        res.status(200).json({ message: "Thêm vào giỏ hàng thành công" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật số lượng item
export const updateCartItem = async (req, res) => {
    try {
        const { error } = updateCartItemValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { id } = req.params; // CartItem ID
        const { quantity } = req.body;

        const item = await CartItem.findOne({ _id: id, deletedAt: null });
        if (!item) return res.status(404).json({ message: "Item không tồn tại trong giỏ" });

        // Check quyền sở hữu (đảm bảo item thuộc cart của user này)
        const cart = await Cart.findOne({ user_id: req.user._id });
        if (!cart || item.cart_id.toString() !== cart._id.toString()) {
            return res.status(403).json({ message: "Không có quyền cập nhật item này" });
        }

        item.quantity = quantity;
        await item.save();

        res.status(200).json({ message: "Cập nhật giỏ hàng thành công", item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa item (Soft delete)
export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CartItem.findOne({ _id: id, deletedAt: null });

        if (!item) return res.status(404).json({ message: "Item không tìm thấy" });

        // Check quyền
        const cart = await Cart.findOne({ user_id: req.user._id });
        if (!cart || item.cart_id.toString() !== cart._id.toString()) {
            return res.status(403).json({ message: "Không có quyền xóa item này" });
        }

        // Soft delete
        item.deletedAt = new Date();
        await item.save();

        res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Khôi phục item (Restore)
export const restoreCartItem = async (req, res) => {
    try {
        const { id } = req.params; // CartItem ID

        // Tìm item đã bị xóa
        const item = await CartItem.findOne({ _id: id, deletedAt: { $ne: null } });

        if (!item) return res.status(404).json({ message: "Không tìm thấy item cần khôi phục" });

        // Check quyền
        const cart = await Cart.findOne({ user_id: req.user._id });
        if (!cart || item.cart_id.toString() !== cart._id.toString()) {
            return res.status(403).json({ message: "Không có quyền khôi phục item này" });
        }

        // Restore
        item.deletedAt = null;
        await item.save();

        res.status(200).json({ message: "Khôi phục sản phẩm thành công", item });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa toàn bộ giỏ (Clear) - Soft delete all
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user._id });
        if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

        await CartItem.updateMany(
            { cart_id: cart._id, deletedAt: null },
            { $set: { deletedAt: new Date() } }
        );

        res.status(200).json({ message: "Đã làm trống giỏ hàng" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
