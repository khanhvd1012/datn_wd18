import Review from "../models/review_MD.js";
import { createReviewValidator, replyReviewValidator } from "../validators/review_VLD.js";

// Lấy tất cả đánh giá (Admin)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user_id", "username fullName email avatar")
            .populate("product_id", "name images")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Lấy tất cả đánh giá thành công",
            data: reviews,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: " + error.message,
        });
    }
};

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

        // Lấy user_id từ token (req.user._id)
        const user_id = req.user?._id || req.body.user_id;

        // Hỗ trợ cả camelCase (frontend) và snake_case
        const product_id = req.body.product_id || req.body.productId;
        const order_item = req.body.order_item || req.body.orderId || null;
        const { images, product_variant_id, rating, comment } = req.body;

        if (!product_id) {
            return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
        }

        const newReview = await Review.create({
            user_id,
            order_item,
            images: images || [],
            product_id,
            product_variant_id: product_variant_id || null,
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
        // Hỗ trợ cả 'reply' (frontend) và 'admin_reply' (legacy)
        const admin_reply = req.body.admin_reply || req.body.reply;

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
