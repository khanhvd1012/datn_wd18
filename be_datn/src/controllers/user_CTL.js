import mongoose from "mongoose";
import User from "../models/user_MD.js";
import { ROLES } from "../config/roles.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log(
      "Role update request - ID:",
      id,
      "Role:",
      role,
      "Type:",
      typeof role,
      "Valid roles:",
      Object.values(ROLES),
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }

    if (!role || !Object.values(ROLES).includes(role)) {
      console.log("Invalid role detected:", role);
      return res
        .status(400)
        .json({
          message:
            "Vai trò không hợp lệ. Các role hợp lệ: " +
            Object.values(ROLES).join(", "),
        });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.role = role;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    console.log("Role updated successfully for user:", id, "new role:", role);
    return res
      .status(200)
      .json({ message: "Cập nhật vai trò thành công", user: userResponse });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }

    if (req.user && req.user._id.toString() === id.toString()) {
      return res.status(400).json({ message: "Bạn không thể xoá chính mình" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xoá người dùng thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    return res.status(200).json({
      message: "Lấy danh sách yêu thích thành công",
      data: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const index = user.favorites.indexOf(productId);
    let message = "";
    if (index === -1) {
      user.favorites.push(productId);
      message = "Đã thêm vào danh sách yêu thích";
    } else {
      user.favorites.splice(index, 1);
      message = "Đã bỏ yêu thích";
    }

    await user.save();

    return res.status(200).json({
      message,
      data: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
