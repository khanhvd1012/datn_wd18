import Joi from "joi";

export const updateUserValidator = Joi.object({
    username: Joi.string().min(3).max(30).messages({
        "string.empty": "Tên người dùng không được để trống",
        "string.min": "Tên người dùng phải có ít nhất 3 ký tự",
        "string.max": "Tên người dùng không vượt quá 30 ký tự",
    }),
    avatar: Joi.string().uri().messages({
        "string.uri": "Link ảnh đại diện không hợp lệ",
    })
});
