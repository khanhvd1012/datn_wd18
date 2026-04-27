/**
 * Script băm lại mật khẩu đang lưu dạng plain text trong MongoDB.
 * Backend đăng nhập dùng bcrypt.compare() nên password trong DB phải là bcrypt hash.
 * Chạy: node hash_existing_passwords.js
 */
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';

dotenv.config();

async function hashExistingPasswords() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Cần set MONGO_URI trong file .env');
    }
    await connectDB(process.env.MONGO_URI);

    const coll = mongoose.connection.db.collection('users');
    const users = await coll.find({}).toArray();
    let updated = 0;

    for (const user of users) {
      const pwd = user.password || '';
      // Bcrypt hash luôn bắt đầu bằng $2a$, $2b$ hoặc $2y$
      if (pwd && !pwd.startsWith('$2')) {
        const hashed = await bcrypt.hash(String(pwd), 10);
        await coll.updateOne(
          { _id: user._id },
          { $set: { password: hashed } }
        );
        console.log('Đã băm mật khẩu cho:', user.email || user._id);
        updated++;
      }
    }

    if (updated === 0) {
      console.log('Không có user nào có mật khẩu plain text. Có thể tất cả đã được băm trước đó.');
    } else {
      console.log('Hoàn tất. Đã cập nhật', updated, 'user. Bạn có thể đăng nhập lại.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

hashExistingPasswords();
