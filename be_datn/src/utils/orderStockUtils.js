import Order from "../models/order_MD.js";
import Product from "../models/product_MD.js";
import Variant from "../models/variant_MD.js";

const adjustItemStock = async (item, delta) => {
    const productId = item.product_id?._id || item.product_id;
    const variantId = item.variant_id?._id || item.variant_id || null;

    if (variantId) {
        const variant = await Variant.findById(variantId);
        if (
            variant &&
            variant.stock !== undefined &&
            variant.stock !== null &&
            (variant.stock > 0 || delta > 0)
        ) {
            await Variant.findByIdAndUpdate(variantId, { $inc: { stock: delta } });
            return;
        }
    }

    if (productId) {
        await Product.findByIdAndUpdate(productId, { $inc: { countInStock: delta } });
    }
};

export const validateOrderStock = async (order) => {
    for (const item of order.order_items) {
        const productId = item.product_id?._id || item.product_id;
        const variantId = item.variant_id?._id || item.variant_id || null;
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error(`Sản phẩm "${item.name}" không tồn tại`);
        }

        let stock = product.countInStock || 0;
        if (variantId) {
            const variant = await Variant.findById(variantId);
            if (variant?.stock !== undefined && variant?.stock !== null && variant.stock > 0) {
                stock = variant.stock;
            }
        }

        if (stock < item.quantity) {
            throw new Error(
                `Sản phẩm "${item.name}" chỉ còn ${stock} trong kho`
            );
        }
    }
};

export const deductOrderStock = async (order) => {
    if (order.stock_deducted) return order;

    await validateOrderStock(order);

    for (const item of order.order_items) {
        await adjustItemStock(item, -item.quantity);
    }

    return Order.findByIdAndUpdate(
        order._id,
        { stock_deducted: true },
        { new: true }
    );
};

export const restoreOrderStock = async (order) => {
    if (!order.stock_deducted) return order;

    for (const item of order.order_items) {
        await adjustItemStock(item, item.quantity);
    }

    return Order.findByIdAndUpdate(
        order._id,
        { stock_deducted: false },
        { new: true }
    );
};
