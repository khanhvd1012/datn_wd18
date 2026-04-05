import Joi from "joi";

export const createReviewValidator = Joi.object({
    // user_id sẽ được lấy từ token (req.user._id), không cần frontend gửi
    user_id: Joi.string().optional(),
    // order_item / orderId không bắt buộc
    order_item: Joi.string().optional().allow(null, ''),
    orderId: Joi.string().optional().allow(null, ''),
    images: Joi.array().items(Joi.string()).optional(),
    // Hỗ trợ cả product_id (snake_case) lẫn productId (camelCase)
    product_id: Joi.string().optional(),
    productId: Joi.string().optional(),
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
    // Hỗ trợ cả 'admin_reply' lẫn 'reply'
    admin_reply: Joi.string().optional(),
    reply: Joi.string().optional()
}).or('admin_reply', 'reply').messages({
    'object.missing': 'Vui lòng nhập nội dung phản hồi'
});
