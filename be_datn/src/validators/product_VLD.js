import Joi from 'joi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/product_MD.js';
import Brand from '../models/brand_MD.js';
import Category from '../models/category_MD.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productSchema = Joi.object({
    name: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Tên sản phẩm không được để trống',
        'string.min': 'Tên sản phẩm phải có ít nhất 3 ký tự',
        'string.max': 'Tên sản phẩm không được vượt quá 200 ký tự',
        'any.required': 'Tên sản phẩm là bắt buộc',
    }),
    description: Joi.string().max(5000).optional().allow('').messages({
        'string.max': 'Mô tả không được vượt quá 5000 ký tự',
    }),
    brand: Joi.string().custom((value, helpers) => {
        if (!value) return value; // Optional field
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('ID thương hiệu không hợp lệ');
        }
        return value;
    }).optional(),
    category: Joi.string().custom((value, helpers) => {
        if (!value) return value; // Optional field
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('ID danh mục không hợp lệ');
        }
        return value;
    }).optional(),
    variants: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message('ID variant không hợp lệ');
            }
            return value;
        })
    ).optional(),
    slug: Joi.string().min(3).max(200).optional().messages({
        'string.min': 'Slug phải có ít nhất 3 ký tự',
        'string.max': 'Slug không được vượt quá 200 ký tự',
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Giá sản phẩm phải là số',
        'number.min': 'Giá sản phẩm không được nhỏ hơn 0',
        'any.required': 'Giá sản phẩm là bắt buộc',
    }),
    original_price: Joi.number().min(0).optional().messages({
        'number.base': 'Giá gốc phải là số',
        'number.min': 'Giá gốc không được nhỏ hơn 0',
    }),
    images: Joi.array().items(Joi.string().uri()).optional(),
    countInStock: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Số lượng tồn kho phải là số',
        'number.integer': 'Số lượng tồn kho phải là số nguyên',
        'number.min': 'Số lượng tồn kho không được nhỏ hơn 0',
    }),
});

export const validateProduct = async (req, res, next) => {
    try {
        // Xử lý images từ files upload
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => 
                `http://localhost:3000/uploads/${file.filename}`
            );
        } else if (req.body.images) {
            // Nếu images là string (từ JSON), parse thành array
            if (typeof req.body.images === 'string') {
                try {
                    req.body.images = JSON.parse(req.body.images);
                } catch (e) {
                    // Nếu không parse được, giữ nguyên
                }
            }
        }

        // Validate dữ liệu
        const { error } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            // Xóa files đã upload nếu có lỗi
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                });
            }

            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }

        // Kiểm tra brand tồn tại
        if (req.body.brand) {
            const brandExists = await Brand.findById(req.body.brand);
            if (!brandExists) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({
                    errors: [{ field: 'brand', message: 'Thương hiệu không tồn tại' }]
                });
            }
        }

        // Kiểm tra category tồn tại
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({
                    errors: [{ field: 'category', message: 'Danh mục không tồn tại' }]
                });
            }
        }

        // Kiểm tra slug unique (chỉ khi tạo mới hoặc slug thay đổi)
        if (req.body.slug) {
            const existingProduct = await Product.findOne({ slug: req.body.slug });
            
            // Nếu đang tạo mới và slug đã tồn tại
            if (!req.params.id && existingProduct) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({
                    errors: [{ field: 'slug', message: 'Slug sản phẩm đã tồn tại' }]
                });
            }

            // Nếu đang cập nhật và slug đã tồn tại ở sản phẩm khác
            if (req.params.id && existingProduct && existingProduct._id.toString() !== req.params.id) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({
                    errors: [{ field: 'slug', message: 'Slug sản phẩm đã tồn tại' }]
                });
            }
        }

        // Kiểm tra original_price phải lớn hơn price nếu có
        if (req.body.original_price && req.body.price) {
            if (req.body.original_price <= req.body.price) {
                if (req.files) {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                return res.status(400).json({
                    errors: [{ field: 'original_price', message: 'Giá gốc phải lớn hơn giá bán' }]
                });
            }
        }

        next();
    } catch (error) {
        console.error('Lỗi xác thực sản phẩm:', error);

        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, "../../public/uploads", file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        }

        return res.status(500).json({
            message: 'Lỗi xác thực dữ liệu sản phẩm',
            error: error.message
        });
    }
};

export default productSchema;
