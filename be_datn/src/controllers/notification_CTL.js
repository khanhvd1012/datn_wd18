import Notification from "../models/notification_MD.js";

// Lấy danh sách thông báo của 1 user
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        // Có thể thêm phân trang ở đây nếu cần thiết
        const notifications = await Notification.find({ user_id: userId })
            .sort({ createdAt: -1 })
            .limit(50); // Mặc định lấy 50 thông báo gần nhất

        return res.status(200).json({
            message: "Lấy danh sách thông báo thành công",
            data: notifications,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi lấy thông báo: " + error.message,
        });
    }
};

// Đánh dấu 1 thông báo là đã đọc
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Không tìm thấy thông báo" });
        }

        return res.status(200).json({
            message: "Đã đánh dấu đọc",
            data: updatedNotification,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi cập nhật thông báo: " + error.message,
        });
    }
};

// Đánh dấu tất cả thông báo của user là đã đọc
export const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        await Notification.updateMany(
            { user_id: userId, read: false },
            { read: true }
        );

        return res.status(200).json({
            message: "Đã đánh dấu đọc tất cả thông báo",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi cập nhật thông báo: " + error.message,
        });
    }
};

// Xoá thông báo
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({ message: "Không tìm thấy thông báo" });
        }

        return res.status(200).json({
            message: "Xoá thông báo thành công",
            data: deletedNotification,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi xoá thông báo: " + error.message,
        });
    }
};
