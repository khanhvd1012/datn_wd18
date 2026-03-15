import Joi from "joi";

export const createOrderValidator = Joi.object({
    shipping_info: Joi.object({
        name: Joi.string().required().messages({
            "string.empty": "Họ tên không được để trống",
            "any.required": "Họ tên là bắt buộc"
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Email không hợp lệ",
            "string.empty": "Email không được để trống",
            "any.required": "Email là bắt buộc"
        }),
        phone: Joi.string().required().messages({
            "string.empty": "Số điện thoại không được để trống",
            "any.required": "Số điện thoại là bắt buộc"
        }),
        address: Joi.string().required().messages({
            "string.empty": "Địa chỉ không được để trống",
            "any.required": "Địa chỉ là bắt buộc"
        })
    }).required(),
    payment_method: Joi.string().valid('cod', 'bank', 'momo', 'vnpay').default('cod'),
    coupon_code: Joi.string().optional().allow(null, ''),
    notes: Joi.string().optional().allow('')
});
