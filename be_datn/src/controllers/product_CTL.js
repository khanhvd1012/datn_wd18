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
                { path: 'brand', select: 'name' }
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
            images: p.images,
            price: p.price,
            original_price: p.original_price,
            description: p.description,
            category: p.category?.name || '',
            brand: p.brand?.name || '',
            countInStock: p.countInStock,
            sold: 0,
            rating: 4.5,
            discount: p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0
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
            .populate('variants');

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
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => 
                `http://localhost:3000/uploads/${file.filename}`
            );
        } else if (req.body.images) {
            // Nếu gửi qua body dạng array string
            productData.images = Array.isArray(req.body.images) 
                ? req.body.images 
                : [req.body.images];
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
        if (req.files && req.files.length > 0) {
            // Xóa ảnh cũ nếu có
            if (existingProduct.images && existingProduct.images.length > 0) {
                existingProduct.images.forEach(img => deleteImageFile(img));
            }
            
            // Thêm ảnh mới
            updateData.images = req.files.map(file => 
                `http://localhost:3000/uploads/${file.filename}`
            );
        } else if (req.body.images) {
            // Nếu gửi qua body
            updateData.images = Array.isArray(req.body.images) 
                ? req.body.images 
                : [req.body.images];
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
