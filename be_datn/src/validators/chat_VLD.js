import Joi from "joi";

export const sendMessageValidator = Joi.object({
    sender_id: Joi.string().required().messages({
        "string.empty": "ID người gửi không được để trống",
        "any.required": "Trường sender_id là bắt buộc"
    }),
    receiver_id: Joi.string().optional(),
    content: Joi.string().required().messages({
        "string.empty": "Nội dung tin nhắn không được để trống",
        "any.required": "Vui lòng nhập nội dung tin nhắn"
    }),
    type: Joi.string().valid('text', 'image', 'file', 'system').default('text').messages({
        "any.only": "Loại tin nhắn không hợp lệ"
    })
});

export const createRoomValidator = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "ID người dùng không được để trống",
        "any.required": "Trường userId là bắt buộc"
    })
});
