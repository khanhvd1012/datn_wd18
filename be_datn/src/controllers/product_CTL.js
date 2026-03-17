import Product from "../models/product_MD.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
    try {
        const { category, page = 1, limit = 100, search } = req.query;

        const query = {};
        
        // Filter theo category nếu có
        if (category) {
            // Tìm category theo name hoặc ID
            const Category = mongoose.model('Categories');
            let categoryDoc = null;
            
            if (mongoose.Types.ObjectId.isValid(category)) {
                categoryDoc = await Category.findById(category);
            } else {
                categoryDoc = await Category.findOne({
                    name: { $regex: category, $options: 'i' }
                });
            }
            
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        // Search theo tên
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: [
                { path: 'category', select: 'name' },
                { path: 'brand', select: 'name' },
                { 
                    path: 'variants',
                    transform: (variant) => {
                    const attrs = variant.attributes || {};
                    const getAttr = (key) => {
                        if (!attrs) return '';
                        if (typeof attrs.get === 'function') return attrs.get(key) || '';
                        return attrs[key] || '';
                    };
                    return {
                        ...variant.toObject(),
                        is_active: variant.is_active !== undefined ? variant.is_active : true,
                        countInStock: variant.stock || 0,
                        color: variant.color || getAttr('color') || '',
                        size: variant.size || getAttr('size') || '',
                        storage: variant.storage || getAttr('storage') || '',
                        material: variant.material || getAttr('material') || ''
                    };
                }
                }
            ],
            sort: { createdAt: -1 }
        };

        const products = await Product.paginate(query, options);

        // Trả về format giống json-server để tương thích với frontend
        res.status(200).json(products.docs.map(p => ({
            id: p._id.toString(),
            _id: p._id.toString(),
            name: p.name,
            img: p.images && p.images.length > 0 ? p.images[0] : '',
            images: Array.isArray(p.images)
                ? p.images.filter((img) => typeof img === 'string' && img.trim())
                : [],
            img:
                Array.isArray(p.images) && p.images.filter((img) => typeof img === 'string' && img.trim()).length > 0
                    ? p.images.filter((img) => typeof img === 'string' && img.trim())[0]
                    : '',
            price: p.price,
            original_price: p.original_price,
            description: p.description,
            category: p.category?.name || '',
            brand: p.brand?.name || '',
            countInStock: p.countInStock,
            sold: 0,
            rating: 4.5,
            discount: p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0,
            variants: p.variants || [], // Include variants in response
            is_active: p.is_active !== undefined ? p.is_active : true, // Default to true for existing products
            slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() // Generate slug if missing
        })));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        res.status(500).json({ 
            message: 'Lỗi máy chủ nội bộ',
            error: error.message 
        });
    }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
        }

        const product = await Product.findById(id)
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate({
                path: 'variants',
                transform: (variant) => {
                    const attrs = variant.attributes || {};
                    const getAttr = (key) => {
                        if (!attrs) return '';
                        if (typeof attrs.get === 'function') return attrs.get(key) || '';
                        return attrs[key] || '';
                    };
                    return {
                        ...variant.toObject(),
                        is_active: variant.is_active !== undefined ? variant.is_active : true,
                        color: variant.color || getAttr('color') || '',
                        size: variant.size || getAttr('size') || '',
                        storage: variant.storage || getAttr('storage') || '',
                        material: variant.material || getAttr('material') || ''
                    };
                }
            });
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ 
            message: 'Lỗi máy chủ nội bộ',
            error: error.message 
        });
    }
};

// Helper: build image URLs from upload files or request body
const buildImageUrls = (req, oldImages = []) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    let images = [];

    // parse existingImages if provided (JSON string or array)
    if (req.body.existingImages !== undefined) {
        if (Array.isArray(req.body.existingImages)) {
            images = req.body.existingImages.filter((img) => typeof img === 'string' && img.trim());
        } else if (typeof req.body.existingImages === 'string') {
            try {
                const parsed = JSON.parse(req.body.existingImages);
                if (Array.isArray(parsed)) {
                    images = parsed.filter((img) => typeof img === 'string' && img.trim());
                } else if (typeof parsed === 'string' && parsed.trim()) {
                    images = [parsed.trim()];
                }
            } catch {
                if (req.body.existingImages.trim()) {
                    images = [req.body.existingImages.trim()];
                }
            }
        }
    }

    // fallback to req.body.images (repeated field) for compatibility
    if ((!images || images.length === 0) && req.body.images !== undefined) {
        if (Array.isArray(req.body.images)) {
            images = req.body.images.filter((img) => typeof img === 'string' && img.trim());
        } else if (typeof req.body.images === 'string' && req.body.images.trim()) {
            images = [req.body.images.trim()];
        }
    }

    // if no explicit list provided, preserve old images in update mode
    if (images.length === 0 && Array.isArray(oldImages) && oldImages.length > 0) {
        images = oldImages;
    }

    // add uploaded files
    if (req.files && req.files.length > 0) {
        const uploaded = req.files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);
        images = [...images, ...uploaded];
    } else if (req.file) {
        images = [...images, `${protocol}://${host}/uploads/${req.file.filename}`];
    }

    images = images.filter((img) => typeof img === 'string' && img.trim() !== '');

    return images;
};

// Helper function để xóa file ảnh
const deleteImageFile = (imageUrl) => {
    if (imageUrl && imageUrl.includes('/uploads/')) {
        const filename = imageUrl.split('/uploads/')[1];
        const filePath = path.join(__dirname, '../../public/uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

// Tạo sản phẩm mới (Admin)
export const createProduct = async (req, res) => {
    try {
        let productData = { ...req.body };

        // Xử lý ảnh upload
        const uploadImages = buildImageUrls(req);
        if (uploadImages && uploadImages.length > 0) {
            productData.images = uploadImages;
        } else {
            productData.images = [];
        }

        // Kiểm tra slug unique
        const existingProduct = await Product.findOne({ slug: productData.slug });
        if (existingProduct) {
            // Xóa file đã upload nếu có
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '../../public/uploads', file.filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                });
            }
            return res.status(400).json({ message: 'Slug đã tồn tại' });
        }

        const product = await Product.create(productData);

        res.status(201).json({
            message: 'Tạo sản phẩm thành công',
            product
        });
    } catch (error) {
        // Xóa file đã upload nếu có lỗi
        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '../../public/uploads', file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        }
        console.error('Lỗi khi tạo sản phẩm:', error);
        res.status(500).json({ 
            message: 'Lỗi máy chủ nội bộ',
            error: error.message 
        });
    }
};

// Cập nhật sản phẩm (Admin)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            // Xóa file đã upload nếu có
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '../../public/uploads', file.filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                });
            }
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Xử lý ảnh upload
        const oldImages = Array.isArray(existingProduct.images) ? existingProduct.images : [];
        const newImages = buildImageUrls(req, oldImages);
        if (newImages !== undefined) {
            // Delete files that were removed by user
            oldImages.forEach((oldImg) => {
                if (!newImages.includes(oldImg)) {
                    deleteImageFile(oldImg);
                }
            });
            updateData.images = newImages;
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            product
        });
    } catch (error) {
        // Xóa file đã upload nếu có lỗi
        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '../../public/uploads', file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        }
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ 
            message: 'Lỗi máy chủ nội bộ',
            error: error.message 
        });
    }
};

// Xóa sản phẩm (Admin)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ 
            message: 'Lỗi máy chủ nội bộ',
            error: error.message 
        });
    }
};
