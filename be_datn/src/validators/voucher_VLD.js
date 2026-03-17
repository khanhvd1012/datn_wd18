import Joi from 'joi';
import mongoose from 'mongoose';
import voucher_MD from '../models/voucher_MD.js';

const voucherSchema = Joi.object({
    code: Joi.string().min(3).max(20).required().messages({
        'string.empty': 'Mã voucher không được để trống',
        'string.min': 'Mã voucher phải có ít nhất 3 ký tự',
        'string.max': 'Mã voucher không được vượt quá 20 ký tự',
        'any.required': 'Mã voucher là bắt buộc'
    }),
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tên voucher không được để trống',
        'string.min': 'Tên voucher phải có ít nhất 3 ký tự',
        'string.max': 'Tên voucher không được vượt quá 100 ký tự',
        'any.required': 'Tên voucher là bắt buộc'
    }),
    description: Joi.string().max(500).optional().messages({
        'string.max': 'Mô tả không được vượt quá 500 ký tự'
    }),
    discount_type: Joi.string().valid('percentage', 'fixed_amount').required().messages({
        'any.only': 'Loại giảm giá phải là percentage hoặc fixed_amount',
        'any.required': 'Loại giảm giá là bắt buộc'
    }),
    discount_value: Joi.number().positive().required().messages({
        'number.base': 'Giá trị giảm giá phải là số',
        'number.positive': 'Giá trị giảm giá phải lớn hơn 0',
        'any.required': 'Giá trị giảm giá là bắt buộc'
    }),
    min_order_amount: Joi.number().min(0).default(0).messages({
        'number.base': 'Giá trị đơn hàng tối thiểu phải là số',
        'number.min': 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0'
    }),
    max_discount_amount: Joi.number().min(0).allow(null).optional().messages({
        'number.base': 'Giảm giá tối đa phải là số',
        'number.min': 'Giảm giá tối đa phải lớn hơn hoặc bằng 0'
    }),
    start_date: Joi.date().required().messages({
        'date.base': 'Ngày bắt đầu không hợp lệ',
        'any.required': 'Ngày bắt đầu là bắt buộc'
    }),
    end_date: Joi.date().min(Joi.ref('start_date')).required().messages({
        'date.base': 'Ngày kết thúc không hợp lệ',
        'date.min': 'Ngày kết thúc phải cùng ngày hoặc sau ngày bắt đầu',
        'any.required': 'Ngày kết thúc là bắt buộc'
    }),
    usage_limit: Joi.number().integer().min(0).allow(null).optional().messages({
        'number.base': 'Giới hạn sử dụng phải là số',
        'number.integer': 'Giới hạn sử dụng phải là số nguyên',
        'number.min': 'Giới hạn sử dụng phải lớn hơn hoặc bằng 0'
    }),
    user_limit: Joi.number().integer().min(0).default(1).messages({
        'number.base': 'Giới hạn mỗi user phải là số',
        'number.integer': 'Giới hạn mỗi user phải là số nguyên',
        'number.min': 'Giới hạn mỗi user phải lớn hơn hoặc bằng 0'
    }),
    applicable_products: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
    ).optional().messages({
        'any.invalid': 'ID sản phẩm không hợp lệ'
    }),
    applicable_categories: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
    ).optional().messages({
        'any.invalid': 'ID danh mục không hợp lệ'
    }),
    applicable_brands: Joi.array().items(
        Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
    ).optional().messages({
        'any.invalid': 'ID thương hiệu không hợp lệ'
    }),
    used_count: Joi.number().integer().min(0).default(0).optional().messages({
        'number.base': 'Số lần đã dùng phải là số',
        'number.integer': 'Số lần đã dùng phải là số nguyên',
        'number.min': 'Số lần đã dùng không được âm'
    }),
    status: Joi.string().valid('active', 'inactive', 'expired').optional().messages({
        'any.only': 'Trạng thái phải là active, inactive hoặc expired'
    })
});

export const validateVoucher = async (req, res, next) => {
    try {
        // Normalize field names from UI
        if (req.body.discount_type === 'fixed') {
            req.body.discount_type = 'fixed_amount';
        }
        if (req.body.min_order_value !== undefined) {
            req.body.min_order_amount = Number(req.body.min_order_value);
        }
        if (req.body.max_discount !== undefined) {
            req.body.max_discount_amount = Number(req.body.max_discount);
        }

        // Convert numeric-like strings to numbers
        const numericFields = ['discount_value', 'min_order_amount', 'max_discount_amount', 'usage_limit', 'user_limit'];
        numericFields.forEach(field => {
            if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
                const parsed = Number(req.body[field]);
                if (!Number.isNaN(parsed)) {
                    req.body[field] = parsed;
                }
            }
        });

        // Ensure defaults for optional numeric fields can stay 0
        if (req.body.min_order_amount === undefined || req.body.min_order_amount === null || req.body.min_order_amount === '') {
            req.body.min_order_amount = 0;
        }
        if (req.body.max_discount_amount === undefined || req.body.max_discount_amount === null || req.body.max_discount_amount === '') {
            req.body.max_discount_amount = 0;
        }
        if (req.body.usage_limit === undefined || req.body.usage_limit === null || req.body.usage_limit === '') {
            req.body.usage_limit = 0;
        }

        // Validate discount_value dựa trên discount_type
        if (req.body.discount_type === 'percentage' && req.body.discount_value > 100) {
            return res.status(400).json({
                success: false,
                message: 'Phần trăm giảm giá không được vượt quá 100%'
            });
        }

        const { error } = voucherSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
        console.log('🔍 validateVoucher req.body:', req.body);
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            console.log('❌ voucher validation errors:', errors);
            return res.status(400).json({
                success: false,
                errors
            });
        }

        // Kiểm tra code trùng (khi tạo mới)
        if (!req.params.id && req.body.code) {
            const existingVoucher = await voucher_MD.findOne({ 
                code: req.body.code.toUpperCase() 
            });

            if (existingVoucher) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã voucher đã tồn tại'
                });
            }
        }

        // Kiểm tra code trùng (khi cập nhật)
        if (req.params.id && req.body.code) {
            const voucher = await voucher_MD.findById(req.params.id);
            if (voucher && req.body.code.toUpperCase() !== voucher.code) {
                const existingVoucher = await voucher_MD.findOne({ 
                    code: req.body.code.toUpperCase(),
                    _id: { $ne: req.params.id }
                });

                if (existingVoucher) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mã voucher đã tồn tại'
                    });
                }
            }
        }

        next();
    } catch (err) {
        console.error('Lỗi khi validate voucher:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực dữ liệu voucher',
            error: err.message
        });
    }
};

export default voucherSchema;
