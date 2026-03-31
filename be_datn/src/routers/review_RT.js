import { Router } from "express";
import {
    createReview,
    getReviewsByProduct,
    replyReview,
    deleteReview,
    getAllReviews,
} from "../controllers/review_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";

const router = Router();

// /api/reviews
router.get("/", checkPermission, checkRole(['admin']), getAllReviews);
router.post("/", checkPermission, createReview);
router.get("/product/:productId", getReviewsByProduct); // Ai cũng có thể xem đánh giá
router.put("/:reviewId/reply", checkPermission, checkRole(['admin']), replyReview);
router.delete("/:reviewId", checkPermission, checkRole(['admin']), deleteReview); // Chỉ Admin (hoặc người sở hữu tuỳ logic) mới xoá

export default router;
