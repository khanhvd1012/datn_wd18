import mongoose from 'mongoose';
import Product from '../models/product_MD.js';
import Brand from '../models/brand_MD.js';
import Category from '../models/category_MD.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import slugify from 'slugify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy tất cả sản phẩm với phân trang và filter
export const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            brand,
            category,
            minPrice,
            maxPrice,
            search,
            sort = '-createdAt'
        } = req.query;

        // Xây dựng query filter
        const filter = {};

        if (brand && mongoose.Types.ObjectId.isValid(brand)) {
            filter.brand = brand;
        }

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Phân trang và populate
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort,
            populate: [
                { path: 'brand', select: 'name logo_image' },
                { path: 'category', select: 'name logo_image' }
            ]
        };

        const products = await Product.paginate(filter, options);

        res.status(200).json({
            products: products.docs,
            pagination: {
                currentPage: products.page,
                totalPages: products.totalPages,
                totalItems: products.totalDocs,
                itemsPerPage: products.limit,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage
            }
        });
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
        }

        const product = await Product.findById(req.params.id)
            .populate('brand', 'name logo_image description')
            .populate('category', 'name logo_image description')
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

// Lấy sản phẩm theo slug
export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('brand', 'name logo_image description')
            .populate('category', 'name logo_image description')
            .populate('variants');

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo slug:', error);
        res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
    try {
        // Xử lý upload images
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => 
                `http://localhost:3000/uploads/${file.filename}`
            );
        } else if (req.body.images && typeof req.body.images === 'string') {
            // Nếu images là string (từ JSON), parse thành array
            req.body.images = JSON.parse(req.body.images);
        }

        // Tạo slug nếu chưa có
        if (!req.body.slug && req.body.name) {
            req.body.slug = slugify(req.body.name, { lower: true, strict: true });
            // Thêm timestamp để đảm bảo unique
            req.body.slug = `${req.body.slug}-${Date.now()}`;
        }

        // Validate brand và category nếu có
        if (req.body.brand && mongoose.Types.ObjectId.isValid(req.body.brand)) {
            const brandExists = await Brand.findById(req.body.brand);
            if (!brandExists) {
                // Xóa files đã upload nếu có
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({ message: 'Thương hiệu không tồn tại' });
            }
        }

        if (req.body.category && mongoose.Types.ObjectId.isValid(req.body.category)) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                // Xóa files đã upload nếu có
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({ message: 'Danh mục không tồn tại' });
            }
        }

        const product = await Product.create(req.body);

        // Cập nhật brand và category với product mới
        if (product.brand) {
            await Brand.findByIdAndUpdate(product.brand, {
                $addToSet: { products: product._id }
            });
        }

        if (product.category) {
            await Category.findByIdAndUpdate(product.category, {
                $addToSet: { products: product._id }
            });
        }

        const createdProduct = await Product.findById(product._id)
            .populate('brand', 'name logo_image')
            .populate('category', 'name logo_image');

        res.status(201).json({
            message: 'Sản phẩm đã được tạo thành công',
            data: createdProduct
        });
    } catch (error) {
        // Xóa files đã upload nếu có lỗi
        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        }

        console.error('Lỗi khi tạo sản phẩm:', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Lỗi xác thực dữ liệu',
                errors: validationErrors
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Slug sản phẩm đã tồn tại',
                error: error.keyValue
            });
        }

        res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            // Xóa files đã upload nếu có
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                });
            }
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Xử lý upload images mới
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => 
                `http://localhost:3000/uploads/${file.filename}`
            );
            
            // Nếu có images cũ, xóa chúng
            if (product.images && product.images.length > 0) {
                product.images.forEach(imageUrl => {
                    if (imageUrl.includes('/uploads/')) {
                        const filename = imageUrl.split('/uploads/')[1];
                        const filePath = path.join(__dirname, "../../public/uploads", filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    }
                });
            }
            
            req.body.images = newImages;
        } else if (req.body.images) {
            // Nếu images là string (từ JSON), parse thành array
            if (typeof req.body.images === 'string') {
                req.body.images = JSON.parse(req.body.images);
            }
        }

        // Tạo slug mới nếu name thay đổi
        if (req.body.name && req.body.name !== product.name) {
            req.body.slug = slugify(req.body.name, { lower: true, strict: true });
            req.body.slug = `${req.body.slug}-${Date.now()}`;
        }

        // Validate brand và category nếu có
        if (req.body.brand && mongoose.Types.ObjectId.isValid(req.body.brand)) {
            const brandExists = await Brand.findById(req.body.brand);
            if (!brandExists) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({ message: 'Thương hiệu không tồn tại' });
            }
        }

        if (req.body.category && mongoose.Types.ObjectId.isValid(req.body.category)) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({ message: 'Danh mục không tồn tại' });
            }
        }

        // Cập nhật brand và category references
        const oldBrand = product.brand;
        const oldCategory = product.category;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('brand', 'name logo_image')
            .populate('category', 'name logo_image');

        // Cập nhật brand references
        if (oldBrand && oldBrand.toString() !== req.body.brand) {
            await Brand.findByIdAndUpdate(oldBrand, {
                $pull: { products: product._id }
            });
        }
        if (req.body.brand && oldBrand?.toString() !== req.body.brand) {
            await Brand.findByIdAndUpdate(req.body.brand, {
                $addToSet: { products: product._id }
            });
        }

        // Cập nhật category references
        if (oldCategory && oldCategory.toString() !== req.body.category) {
            await Category.findByIdAndUpdate(oldCategory, {
                $pull: { products: product._id }
            });
        }
        if (req.body.category && oldCategory?.toString() !== req.body.category) {
            await Category.findByIdAndUpdate(req.body.category, {
                $addToSet: { products: product._id }
            });
        }

        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct
        });
    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        }

        console.error('Lỗi khi cập nhật sản phẩm:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Slug sản phẩm đã tồn tại',
                error: error.keyValue
            });
        }

        res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Xóa images nếu có
        if (product.images && product.images.length > 0) {
            product.images.forEach(imageUrl => {
                if (imageUrl.includes('/uploads/')) {
                    const filename = imageUrl.split('/uploads/')[1];
                    const filePath = path.join(__dirname, "../../public/uploads", filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                }
            });
        }

        // Xóa product khỏi brand và category
        if (product.brand) {
            await Brand.findByIdAndUpdate(product.brand, {
                $pull: { products: product._id }
            });
        }

        if (product.category) {
            await Category.findByIdAndUpdate(product.category, {
                $pull: { products: product._id }
            });
        }

        // Xóa sản phẩm
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};
