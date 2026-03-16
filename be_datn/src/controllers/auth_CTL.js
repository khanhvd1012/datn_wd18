import User from "../models/user_MD.js";
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth_VLD.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        const { error } = registerValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map((detail) => detail.message);
            return res.status(400).json({ messages });
        }

        // Check email exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        user.password = undefined; // Hide password in response

        return res.status(201).json({
            message: "Đăng ký thành công",
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const { error } = loginValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map((detail) => detail.message);
            return res.status(400).json({ messages });
        }

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Generate Token (tăng thời hạn lên 7 ngày)
        const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        user.password = undefined;

        return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken,
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            user
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// Yêu cầu quên mật khẩu
export const forgotPassword = async (req, res) => {
    try {
        const { error } = forgotPasswordValidator.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map((e) => e.message) });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
        }

        // Tạo chuỗi token ngẫu nhiên
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Lưu vào DB, hết hạn sau 15 phút
        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Gửi email
        const resetUrl = `${process.env.FE_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Hỗ Trợ Dự Án" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <h3>Chào ${user.username},</h3>
                <p>Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu bảo vệ tài khoản.</p>
                <p>Vui lòng click vào link bên dưới để tạo mật khẩu mới (Link này sẽ hết hạn sau 15 phút):</p>
                <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; display: inline-block;">Đặt Lại Mật Khẩu</a>
                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi đi" });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Đặt lại mật khẩu mới
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const { error } = resetPasswordValidator.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map((e) => e.message) });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Tìm user có token khớp và token chưa hết hạn
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() } // Lớn hơn thời gian hiện tại
        });

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }

        // Cập nhật lại mật khẩu mới
        user.password = await bcrypt.hash(password, 10);
        
        // Xoá thông tin token để bảo mật
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ" });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
