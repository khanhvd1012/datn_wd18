import Joi from "joi";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import news_MD from "../models/news_MD.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsSchema = Joi.object({
  title: Joi.string().min(5).max(200).trim().required().messages({
    "string.empty": "Tiêu đề không được để trống",
    "string.min": "Tiêu đề phải có ít nhất 5 ký tự",
    "string.max": "Tiêu đề không vượt quá 200 ký tự",
    "any.required": "Tiêu đề là bắt buộc",
  }),

  content: Joi.string().min(10).trim().required().messages({
    "string.empty": "Nội dung không được để trống",
    "string.min": "Nội dung phải có ít nhất 10 ký tự",
    "any.required": "Nội dung là bắt buộc",
  }),

  images: Joi.array().optional(),

  existingImages: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),

  status: Joi.string()
    .valid("draft", "published", "archived")
    .optional()
    .messages({
      "any.only": "Trạng thái không hợp lệ",
    }),
});

export const validateNews = async (req, res, next) => {
  try {
    const isUpdate = !!req.params.id;

    // Trim input in case it's not handled by Joi properly
    if (req.body.title) req.body.title = req.body.title.trim();
    if (req.body.content) req.body.content = req.body.content.trim();

    // Gán đường dẫn ảnh từ multer if any
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(
        (file) => `http://localhost:3000/uploads/${file.filename}`,
      );
    }

    // Validate bằng Joi - cho phép các field không khai báo (multipart form có thể có field thừa)
    const { error } = newsSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      if (req.files) {
        req.files.forEach((file) => {
          const filePath = path.join(
            __dirname,
            "../../public/uploads",
            file.filename,
          );
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }

      const errors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    // Kiểm tra tiêu đề trùng (khi tạo hoặc update)
    if (req.body.title) {
      const existing = await news_MD.findOne({
        title: { $regex: new RegExp(`^${req.body.title}$`, "i") },
      });

      if (!isUpdate && existing) {
        if (req.files) {
          req.files.forEach((file) => {
            const filePath = path.join(
              __dirname,
              "../../public/uploads",
              file.filename,
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
        }
        return res.status(400).json({
          errors: [{ field: "title", message: "Tiêu đề tin tức đã tồn tại" }],
        });
      }

      if (isUpdate && existing && existing._id.toString() !== req.params.id) {
        if (req.files) {
          req.files.forEach((file) => {
            const filePath = path.join(
              __dirname,
              "../../public/uploads",
              file.filename,
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
        }
        return res.status(400).json({
          errors: [{ field: "title", message: "Tiêu đề tin tức đã tồn tại" }],
        });
      }
    }

    next();
  } catch (err) {
    console.error("Lỗi khi validate tin tức:", err);
    if (req.files) {
      req.files.forEach((file) => {
        const filePath = path.join(
          __dirname,
          "../../public/uploads",
          file.filename,
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    return res.status(500).json({
      message: "Lỗi xác thực dữ liệu tin tức",
      error: err.message,
    });
  }
};
