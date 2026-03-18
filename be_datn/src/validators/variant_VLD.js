import Joi from "joi";

export const createVariantValidator = Joi.object({
    product: Joi.string().required().messages({
        "string.empty": "Mã sản phẩm không được để trống",
        "any.required": "Mã sản phẩm là bắt buộc"
    }),
    name: Joi.string().required().messages({
        "string.empty": "Tên biến thể không được để trống",
        "any.required": "Tên biến thể là bắt buộc"
    }),
    sku: Joi.string().optional().allow(null, ""),
    attributes: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
    price: Joi.number().min(0).required().messages({
        "number.min": "Giá phải lớn hơn hoặc bằng 0",
        "any.required": "Giá là bắt buộc"
    }),
    original_price: Joi.number().min(0).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    existingImages: Joi.any().optional(),
    stock: Joi.number().min(0).default(0),
    countInStock: Joi.number().min(0).optional(),
    color: Joi.string().optional().allow('', null),
    size: Joi.string().optional().allow('', null),
    storage: Joi.string().optional().allow('', null),
    material: Joi.string().optional().allow('', null),
    is_active: Joi.boolean().default(true),
    is_default: Joi.boolean().default(false)
});

export const updateVariantValidator = Joi.object({
    name: Joi.string().optional(),
    sku: Joi.string().optional().allow(null, ""),
    attributes: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
    price: Joi.number().min(0).optional(),
    original_price: Joi.number().min(0).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    existingImages: Joi.any().optional(),
    stock: Joi.number().min(0).optional(),
    color: Joi.string().optional().allow('', null),
    size: Joi.string().optional().allow('', null),
    storage: Joi.string().optional().allow('', null),
    material: Joi.string().optional().allow('', null),
    is_active: Joi.boolean().optional(),
    is_default: Joi.boolean().optional(),
    countInStock: Joi.number().min(0).optional()
});
