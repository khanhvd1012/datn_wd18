import Joi from "joi";
import { ROLES } from "../config/roles.js";

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
  confirmPassword: Joi.string().valid(Joi.ref("password")).optional().messages({
    "any.only": "Mật khẩu nhập lại không khớp",
  }),
  fullName: Joi.string().min(2).max(50).optional().messages({
    "string.base": "Họ và tên phải là chuỗi",
    "string.min": "Họ và tên phải có từ 2-50 ký tự",
    "string.max": "Họ và tên phải có từ 2-50 ký tự",
  }),
  phone: Joi.string()
    .pattern(/^[0-9()+\-\s]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Số điện thoại không hợp lệ",
    }),
  dateOfBirth: Joi.date().less("now").optional().messages({
    "date.base": "Ngày sinh không hợp lệ",
    "date.less": "Ngày sinh phải nhỏ hơn ngày hiện tại",
  }),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .default(ROLES.CUSTOMER)
    .messages({
      "any.only": "Vai trò không hợp lệ",
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

export const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Vui lòng nhập Email",
  }),
});

export const resetPasswordValidator = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu mới không được để trống",
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
    "any.required": "Vui lòng nhập Mật khẩu mới",
  }),
});

export const updateProfileValidator = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  fullName: Joi.string().min(2).max(50).optional().allow('', null),
  phone: Joi.string().pattern(/^[0-9()+\-\s]{7,20}$/).optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  avatar: Joi.string().optional().allow('', null),
  dateOfBirth: Joi.date().less("now").optional().allow('', null),
});

export const changePasswordValidator = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Mật khẩu cũ không được để trống",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu mới không được để trống",
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Xác nhận mật khẩu không khớp",
  }),
});
