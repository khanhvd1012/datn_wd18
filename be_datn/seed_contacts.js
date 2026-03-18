import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contact_MD from './src/models/contact_MD.js';

dotenv.config();

const sampleContacts = [
  {
    username: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    phone: '0987654321',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    message: 'Sản phẩm rất tốt, tôi muốn hỏi thêm về chính sách bảo hành.',
  },
  {
    username: 'Tran Thi B',
    email: 'tranthib@example.com',
    phone: '+84987654321',
    address: '45 Đường Nguyễn Trãi, Quận 5, TP.HCM',
    message: 'Cho tôi biết thời gian giao hàng cho đơn hàng nội thành.',
  },
  {
    username: 'Le Van C',
    email: 'levanc@example.com',
    phone: '0912345678',
    address: '78 Đường Phan Xích Long, Phú Nhuận, TP.HCM',
    message: 'Tôi muốn đổi sản phẩm khác được không?',
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await contact_MD.deleteMany({});
    console.log('🧹 Đã xóa tất cả phản hồi cũ');

    const created = await contact_MD.insertMany(sampleContacts);
    console.log(`🌱 Đã thêm ${created.length} phản hồi mẫu`);

    const all = await contact_MD.find().sort({ createdAt: -1 });
    console.log('📦 Dữ liệu hiện tại:', all.map((c) => ({ id: c._id.toString(), username: c.username, email: c.email })));

    await mongoose.disconnect();
    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Lỗi seed phản hồi:', err);
    process.exit(1);
  }
};

run();