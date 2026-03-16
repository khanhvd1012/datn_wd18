import Joi from "joi";

export const createReviewValidator = Joi.object({
    user_id: Joi.string().required().messages({
        "string.empty": "Mã người dùng không được để trống",
        "any.required": "Trường user_id là bắt buộc"
    }),
    order_item: Joi.string().required().messages({
        "string.empty": "Mã sản phẩm trong đơn hàng không được để trống",
        "any.required": "Trường order_item là bắt buộc"
    }),
    images: Joi.array().items(Joi.string().uri()).optional().messages({
        "string.uri": "Link hình ảnh không hợp lệ",
    }),
    product_id: Joi.string().required().messages({
        "string.empty": "Mã sản phẩm không được để trống",
        "any.required": "Trường product_id là bắt buộc"
    }),
    product_variant_id: Joi.string().optional(),
    rating: Joi.number().min(1).max(5).required().messages({
        "number.base": "Đánh giá sao phải là một số",
        "number.min": "Đánh giá sao tối thiểu là 1",
        "number.max": "Đánh giá sao tối đa là 5",
        "any.required": "Vui lòng chọn số sao đánh giá"
    }),
    comment: Joi.string().required().messages({
        "string.empty": "Nội dung đánh giá không được để trống",
        "any.required": "Trường comment là bắt buộc"
    })
});

export const replyReviewValidator = Joi.object({
    admin_reply: Joi.string().required().messages({
        "string.empty": "Nội dung phản hồi không được để trống",
        "any.required": "Trường admin_reply là bắt buộc"
    })
});
