import Joi from 'joi';
import mongoose from 'mongoose';
import stock_MD from '../models/stock_MD.js';
import product_MD from '../models/product_MD.js';

const stockSchema = Joi.object({
    product: Joi.string().required().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'any.required': 'Sản phẩm là bắt buộc',
        'any.invalid': 'ID sản phẩm không hợp lệ'
    }),
    variant: Joi.string().optional().allow(null).custom((value, helpers) => {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'any.invalid': 'ID variant không hợp lệ'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
        'number.base': 'Số lượng phải là số',
        'number.integer': 'Số lượng phải là số nguyên',
        'number.min': 'Số lượng không được nhỏ hơn 0',
        'any.required': 'Số lượng là bắt buộc'
    }),
    reserved_quantity: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Số lượng đặt trước phải là số',
        'number.integer': 'Số lượng đặt trước phải là số nguyên',
        'number.min': 'Số lượng đặt trước không được nhỏ hơn 0'
    }),
    location: Joi.string().max(200).optional().messages({
        'string.max': 'Vị trí kho không được vượt quá 200 ký tự'
    }),
    min_stock_level: Joi.number().integer().min(0).default(10).messages({
        'number.base': 'Mức tồn kho tối thiểu phải là số',
        'number.integer': 'Mức tồn kho tối thiểu phải là số nguyên',
        'number.min': 'Mức tồn kho tối thiểu không được nhỏ hơn 0'
    }),
    notes: Joi.string().max(500).optional().messages({
        'string.max': 'Ghi chú không được vượt quá 500 ký tự'
    })
});

export const validateStock = async (req, res, next) => {
    try {
        const { error } = stockSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                errors
            });
        }

        // Kiểm tra product có tồn tại không
        if (req.body.product) {
            const product = await product_MD.findById(req.body.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Sản phẩm không tồn tại'
                });
            }
        }

        // Kiểm tra trùng product + variant (khi tạo mới)
        if (!req.params.id && req.body.product) {
            const existingStock = await stock_MD.findOne({
                product: req.body.product,
                variant: req.body.variant || null
            });

            if (existingStock) {
                return res.status(400).json({
                    success: false,
                    message: 'Kho hàng cho sản phẩm này đã tồn tại'
                });
            }
        }

        next();
    } catch (err) {
        console.error('Lỗi khi validate stock:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực dữ liệu kho hàng',
            error: err.message
        });
    }
};

// Schema cho update quantity
const updateQuantitySchema = Joi.object({
    quantity_change: Joi.number().positive().required().messages({
        'number.base': 'Số lượng thay đổi phải là số',
        'number.positive': 'Số lượng thay đổi phải lớn hơn 0',
        'any.required': 'Số lượng thay đổi là bắt buộc'
    }),
    type: Joi.string().valid('import', 'export').required().messages({
        'any.only': 'Loại cập nhật phải là import hoặc export',
        'any.required': 'Loại cập nhật là bắt buộc'
    }),
    notes: Joi.string().max(500).optional().messages({
        'string.max': 'Ghi chú không được vượt quá 500 ký tự'
    })
});

export const validateUpdateQuantity = async (req, res, next) => {
    try {
        const { error } = updateQuantitySchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                errors
            });
        }

        next();
    } catch (err) {
        console.error('Lỗi khi validate update quantity:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực dữ liệu',
            error: err.message
        });
    }
};

// Schema cho reserve stock
const reserveStockSchema = Joi.object({
    quantity: Joi.number().integer().positive().required().messages({
        'number.base': 'Số lượng phải là số',
        'number.integer': 'Số lượng phải là số nguyên',
        'number.positive': 'Số lượng phải lớn hơn 0',
        'any.required': 'Số lượng là bắt buộc'
    })
});

export const validateReserveStock = async (req, res, next) => {
    try {
        const { error } = reserveStockSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                errors
            });
        }

        next();
    } catch (err) {
        console.error('Lỗi khi validate reserve stock:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực dữ liệu',
            error: err.message
        });
    }
};

export default stockSchema;
