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
