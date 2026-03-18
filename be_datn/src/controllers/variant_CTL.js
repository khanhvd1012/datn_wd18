import Variant from "../models/variant_MD.js";
import Product from "../models/product_MD.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createVariantValidator, updateVariantValidator } from "../validators/variant_VLD.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildVariantImageUrls = (req) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';

    let images = [];

    // Get existing images from existingImages field (JSON string or array)
    if (req.body.existingImages !== undefined) {
        let parsedImages = [];
        if (Array.isArray(req.body.existingImages)) {
            parsedImages = req.body.existingImages;
        } else if (typeof req.body.existingImages === 'string') {
            try {
                const parsed = JSON.parse(req.body.existingImages);
                if (Array.isArray(parsed)) {
                    parsedImages = parsed;
                } else if (typeof parsed === 'string') {
                    parsedImages = [parsed];
                }
            } catch {
                if (req.body.existingImages.trim()) {
                    parsedImages = [req.body.existingImages.trim()];
                }
            }
        }
        images = parsedImages.filter((img) => typeof img === 'string' && img.trim() !== '');
    }

    // fallback to req.body.images repeated field compatibility
    if ((images.length === 0 || req.body.existingImages === undefined) && req.body.images !== undefined) {
        if (Array.isArray(req.body.images)) {
            images = req.body.images.filter((img) => typeof img === 'string' && img.trim() !== '');
        } else if (typeof req.body.images === 'string' && req.body.images.trim()) {
            images = [req.body.images.trim()];
        }
    }

    // Add uploaded files
    if (req.files && req.files.length > 0) {
        const uploaded = req.files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);
        images = [...images, ...uploaded];
    } else if (req.file) {
        images = [...images, `${protocol}://${host}/uploads/${req.file.filename}`];
    }

    return images;
};

const parseVariantAttributes = (raw) => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
};

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
        // Normalize attributes before validation, because multipart/form-data sends strings
        req.body.attributes = parseVariantAttributes(req.body.attributes);

        const { error } = createVariantValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { product, is_default, countInStock, color, size, storage, material, attributes, ...variantData } = req.body;
        const parsedAttributes = parseVariantAttributes(attributes);
        if (countInStock !== undefined) {
            variantData.stock = countInStock;
        }
        variantData.attributes = parsedAttributes;
        variantData.color = color || parsedAttributes?.color || '';
        variantData.size = size || parsedAttributes?.size || '';
        variantData.storage = storage || parsedAttributes?.storage || '';
        variantData.material = material || parsedAttributes?.material || '';

        const uploadImages = buildVariantImageUrls(req);
        if (uploadImages) {
            variantData.images = uploadImages;
        }

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
        console.log('🔧 Backend received update request for variant ID:', req.params.id);
        console.log('🔧 Backend received update data:', req.body);
        
        // Normalize attributes before validation
        req.body.attributes = parseVariantAttributes(req.body.attributes);

        const { error } = updateVariantValidator.validate(req.body);
        if (error) {
            console.log('❌ Validation error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { id } = req.params;
        const { is_default, countInStock, color, size, storage, material, attributes, ...updateData } = req.body;

        const parsedAttributes = parseVariantAttributes(attributes || updateData.attributes);
        if (countInStock !== undefined) {
            updateData.stock = countInStock;
        }
        updateData.attributes = parsedAttributes;
        updateData.color = color || updateData.color || parsedAttributes?.color || '';
        updateData.size = size || updateData.size || parsedAttributes?.size || '';
        updateData.storage = storage || updateData.storage || parsedAttributes?.storage || '';
        updateData.material = material || updateData.material || parsedAttributes?.material || '';

        const variant = await Variant.findById(id);
        if (!variant) {
            console.log('❌ Variant not found:', id);
            return res.status(404).json({ message: "Biến thể không tồn tại" });
        }

        const uploadImages = buildVariantImageUrls(req);
        if (uploadImages !== undefined) {
            const newImages = uploadImages;
            const oldImages = Array.isArray(variant.images) ? variant.images : [];
            oldImages.forEach((oldImg) => {
                if (!newImages.includes(oldImg)) {
                    if (oldImg.includes('/uploads/')) {
                        const filename = oldImg.split('/uploads/')[1];
                        const filePath = path.join(__dirname, '../../public/uploads', filename);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                }
            });
            updateData.images = newImages;
        }

        console.log('🔧 Extracted updateData:', updateData);
        console.log('🔧 is_default:', is_default);

        console.log('✅ Found variant:', variant);

        // Nếu set làm default, bỏ default của các variant khác cùng product
        if (is_default !== undefined && is_default) {
            await Variant.updateMany(
                { product: variant.product, _id: { $ne: id } },
                { $set: { is_default: false } }
            );
        }

        // Nếu un-default variant hiện tại thì đảm bảo ít nhất 1 variant mặc định vẫn còn (nếu cần)
        if (is_default !== undefined && !is_default && variant.is_default) {
            const otherDefault = await Variant.findOne({ product: variant.product, _id: { $ne: id }, is_active: true });
            if (otherDefault) {
                await Variant.findByIdAndUpdate(otherDefault._id, { is_default: true });
            }
        }

        const updatedVariant = await Variant.findByIdAndUpdate(
            id,
            {
                ...updateData,
                is_default: is_default !== undefined ? is_default : variant.is_default
            },
            { new: true, runValidators: true }
        );

        console.log('✅ Updated variant:', updatedVariant);

        res.status(200).json({
            message: "Cập nhật biến thể thành công",
            variant: updatedVariant
        });
    } catch (error) {
        console.error('❌ Update error:', error);
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
