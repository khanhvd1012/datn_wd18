import Joi from "joi";

export const registerValidator = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.base": "Username phải là chuỗi",
        "string.empty": "Username không được để trống",
        "string.min": "Username phải có ít nhất 3 ký tự",
        "string.max": "Username không được quá 30 ký tự",
        "any.required": "Username là bắt buộc",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Email không được để trống",
        "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là bắt buộc",
    }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Mật khẩu nhập lại không khớp",
        "any.required": "Mật khẩu nhập lại là bắt buộc",
    }),
});

export const loginValidator = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Email không được để trống",
        "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là bắt buộc",
    }),
});
