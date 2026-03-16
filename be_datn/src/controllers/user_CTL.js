import User from "../models/user_MD.js";
import { updateUserValidator } from "../validators/user_VLD.js";

// Lấy danh sách toàn bộ Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng nào" });
        }
        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: " + error.message,
        });
    }
};

// Lấy thông tin chi tiết một User
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        return res.status(200).json({
            message: "Lấy thông tin người dùng thành công",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: " + error.message,
        });
    }
};

// Cập nhật thông tin User (Profile)
export const updateUser = async (req, res) => {
    try {
        const { error } = updateUserValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { username, avatar } = req.body;
        // Chỉ cho cập nhật một số thông tin cơ bản, không cập nhật password hay role ở đây
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, avatar },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật" });
        }
        return res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: " + error.message,
        });
    }
};

// Xoá User
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xoá" });
        }
        return res.status(200).json({
            message: "Xoá người dùng thành công",
            data: deletedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server: " + error.message,
        });
    }
};
