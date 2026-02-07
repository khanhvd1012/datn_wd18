import jwt from "jsonwebtoken";
import User from "../models/user_MD.js";
import dotenv from "dotenv";

dotenv.config();

export const checkPermission = async (req, res, next) => {
    try {
        // Check Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập" });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Find user
            const user = await User.findById(decoded._id).select('-password');
            if (!user) {
                return res.status(401).json({ message: "Token không hợp lệ" });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token đã hết hạn" });
            }
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
        }
        next();
    }
}
