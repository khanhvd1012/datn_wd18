import ChatRoom from "../models/chatRoom_MD.js";
import Message from "../models/message_MD.js";
import User from "../models/user_MD.js";
import { sendMessageValidator, createRoomValidator } from "../validators/chat_VLD.js";

// 1. Tạo hoặc lấy phòng chat giữa 1 User và Admin
// Trong mô hình này, ta giả định phòng chat luôn là giữa 1 User và Admin (dựa vào mảng participants)
export const createOrGetRoom = async (req, res) => {
    try {
        const { error } = createRoomValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { userId } = req.body; // ID của khách hàng

        // Kiểm tra xem phòng chat cho user này đã tồn tại chưa
        let room = await ChatRoom.findOne({ participants: { $in: [userId] } })
            .populate("participants", "username avatar role");

        if (!room) {
            // Nếu chưa có, tạo phòng mới
            // Lấy ID của một Admin bất kỳ hoặc hệ thống tự assign (tạm thời add mỗi user vào)
            room = await ChatRoom.create({
                participants: [userId],
                isEmployeeJoined: false
            });
            room = await room.populate("participants", "username avatar role");
        }

        return res.status(200).json({
            message: "Lấy thông tin phòng chat thành công",
            data: room,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi tạo phòng chat: " + error.message,
        });
    }
};

// 2. Lấy danh sách các phòng chat (Dành cho Admin/Nhân viên quản lý)
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await ChatRoom.find()
            .populate("participants", "username avatar role")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            message: "Lấy danh sách phòng chat thành công",
            data: rooms,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi lấy danh sách phòng chat: " + error.message,
        });
    }
};

// 3. Gửi tin nhắn vào phòng
export const sendMessage = async (req, res) => {
    try {
        const { error } = sendMessageValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { roomId } = req.params;
        const { sender_id, receiver_id, content, type } = req.body;

        const newMessage = await Message.create({
            chatRoom_id: roomId,
            sender_id,
            receiver_id,
            content,
            type: type || 'text'
        });

        // Cập nhật lastMessage cho phòng chat
        await ChatRoom.findByIdAndUpdate(roomId, {
            lastMessage: newMessage._id
        });

        // Tối ưu UI realtime thì cần gửi socket ở đây

        return res.status(201).json({
            message: "Gửi tin nhắn thành công",
            data: newMessage,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi gửi tin nhắn: " + error.message,
        });
    }
};

// 4. Lấy lịch sử tin nhắn của 1 phòng
export const getMessagesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        
        const messages = await Message.find({ chatRoom_id: roomId })
            .populate("sender_id", "username avatar role")
            .sort({ createdAt: 1 }); // Sắp xếp cũ -> mới để hiện thị UI chat

        return res.status(200).json({
            message: "Lấy lịch sử tin nhắn thành công",
            data: messages,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi lấy lịch sử tin nhắn: " + error.message,
        });
    }
};
