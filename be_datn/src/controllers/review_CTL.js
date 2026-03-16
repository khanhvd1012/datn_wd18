import Review from "../models/review_MD.js";
import { createReviewValidator, replyReviewValidator } from "../validators/review_VLD.js";

// Lấy toàn bộ đánh giá của một sản phẩm
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product_id: productId })
            .populate("user_id", "username avatar")
            .populate("product_variant_id", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Lấy danh sách đánh giá thành công",
            data: reviews,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: " + error.message,
        });
    }
};

// Tạo đánh giá mới (dành cho người dùng)
export const createReview = async (req, res) => {
    try {
        const { error } = createReviewValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { user_id, order_item, images, product_id, product_variant_id, rating, comment } = req.body;

        // Lưu ý: Cần thêm logic kiểm tra xem user_id đã mua product_id chưa (thường xử lý ở đây hoặc middleware)

        const newReview = await Review.create({
            user_id,
            order_item,
            images,
            product_id,
            product_variant_id,
            rating,
            comment,
        });

        return res.status(201).json({
            message: "Cảm ơn bạn đã đánh giá sản phẩm",
            data: newReview,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi tạo đánh giá: " + error.message,
        });
    }
};

// Admin phản hồi đánh giá
export const replyReview = async (req, res) => {
    try {
        const { error } = replyReviewValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { reviewId } = req.params;
        const { admin_reply } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { admin_reply },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá này" });
        }

        return res.status(200).json({
            message: "Đã phản hồi đánh giá",
            data: updatedReview,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi phản hồi: " + error.message,
        });
    }
};

// Xoá đánh giá
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá" });
        }

        return res.status(200).json({
            message: "Xoá đánh giá thành công",
            data: deletedReview,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi xoá đánh giá: " + error.message,
        });
    }
};
