import Joi from "joi";

export const addToCartValidator = Joi.object({
    product_id: Joi.string().required().messages({
        "string.empty": "Mã sản phẩm không được để trống",
        "any.required": "Mã sản phẩm là bắt buộc"
    }),
    quantity: Joi.number().min(1).default(1).messages({
        "number.min": "Số lượng phải lớn hơn hoặc bằng 1"
    }),
    variant_id: Joi.string().optional()
});

export const updateCartItemValidator = Joi.object({
    quantity: Joi.number().min(1).required().messages({
        "number.min": "Số lượng phải lớn hơn hoặc bằng 1",
        "any.required": "Số lượng là bắt buộc"
    })
});
