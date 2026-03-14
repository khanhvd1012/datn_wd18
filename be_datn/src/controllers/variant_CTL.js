import Variant from "../models/variant_MD.js";
import Product from "../models/product_MD.js";
import { createVariantValidator, updateVariantValidator } from "../validators/variant_VLD.js";

// Lấy tất cả variants của một sản phẩm
export const getVariantsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const variants = await Variant.find({ 
            product: productId,
            is_active: true 
        }).sort({ is_default: -1, createdAt: -1 });

        res.status(200).json({
            message: "Lấy danh sách biến thể thành công",
            variants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một variant
export const getVariantById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const variant = await Variant.findById(id).populate("product", "name slug");
        
        if (!variant) {
            return res.status(404).json({ message: "Biến thể không tồn tại" });
        }

        res.status(200).json({
            message: "Lấy thông tin biến thể thành công",
            variant
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo variant mới
export const createVariant = async (req, res) => {
    try {
        const { error } = createVariantValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { product, is_default, ...variantData } = req.body;

        // Kiểm tra sản phẩm tồn tại
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Nếu set làm default, bỏ default của các variant khác
        if (is_default) {
            await Variant.updateMany(
                { product: product },
                { $set: { is_default: false } }
            );
        }

        const variant = await Variant.create({
            product,
            is_default: is_default || false,
            ...variantData
        });

        // Thêm variant vào danh sách variants của product
        await Product.findByIdAndUpdate(product, {
            $push: { variants: variant._id }
        });

        res.status(201).json({
            message: "Tạo biến thể thành công",
            variant
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật variant
export const updateVariant = async (req, res) => {
    try {
        const { error } = updateVariantValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { id } = req.params;
        const { is_default, ...updateData } = req.body;

        const variant = await Variant.findById(id);
        if (!variant) {
            return res.status(404).json({ message: "Biến thể không tồn tại" });
        }

        // Nếu set làm default, bỏ default của các variant khác cùng product
        if (is_default !== undefined && is_default) {
            await Variant.updateMany(
                { product: variant.product, _id: { $ne: id } },
                { $set: { is_default: false } }
            );
        }

        const updatedVariant = await Variant.findByIdAndUpdate(
            id,
            { ...updateData, is_default: is_default !== undefined ? is_default : variant.is_default },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Cập nhật biến thể thành công",
            variant: updatedVariant
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa variant (soft delete bằng cách set is_active = false)
export const deleteVariant = async (req, res) => {
    try {
        const { id } = req.params;

        const variant = await Variant.findById(id);
        if (!variant) {
            return res.status(404).json({ message: "Biến thể không tồn tại" });
        }

        // Nếu là variant default, set variant khác làm default
        if (variant.is_default) {
            const otherVariant = await Variant.findOne({
                product: variant.product,
                _id: { $ne: id },
                is_active: true
            });
            
            if (otherVariant) {
                otherVariant.is_default = true;
                await otherVariant.save();
            }
        }

        variant.is_active = false;
        await variant.save();

        // Xóa variant khỏi danh sách variants của product
        await Product.findByIdAndUpdate(variant.product, {
            $pull: { variants: variant._id }
        });

        res.status(200).json({
            message: "Xóa biến thể thành công"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả variants (admin)
export const getAllVariants = async (req, res) => {
    try {
        const { product, is_active } = req.query;
        
        const filter = {};
        if (product) filter.product = product;
        if (is_active !== undefined) filter.is_active = is_active === 'true';

        const variants = await Variant.find(filter)
            .populate("product", "name slug")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Lấy danh sách biến thể thành công",
            variants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
