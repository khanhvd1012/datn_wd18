/**
 * Script kiểm tra tất cả user trong MongoDB
 * Chạy: node check_users.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

dotenv.config();

async function checkUsers() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Cần set MONGO_URI trong file .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected\n');

    const coll = mongoose.connection.db.collection('users');
    const users = await coll.find({}).toArray();

    console.log('=== TỔNG SỐ USER:', users.length, '===\n');

    for (const u of users) {
      console.log('---');
      console.log('  _id       :', u._id.toString());
      console.log('  email     :', u.email);
      console.log('  username  :', u.username);
      console.log('  name      :', u.name);
      console.log('  role      :', u.role);
      console.log('  password  :', u.password ? (u.password.startsWith('$2') ? '[BCRYPT HASH - OK]' : '[PLAIN TEXT - LỖI]') : '[NULL]');
    }

    // Thử login thử
    console.log('\n=== TEST LOGIN với admin@mobitech.com / admin1234 ===');
    const admin = await coll.findOne({ email: 'admin@mobitech.com' });
    if (!admin) {
      console.log('Không tìm thấy user với email admin@mobitech.com');
    } else {
      console.log('Tìm thấy admin:', { email: admin.email, username: admin.username, role: admin.role });
      const testHash = await bcrypt.hash('admin1234', 10);
      console.log('  Hash mới tạo :', testHash);
      console.log('  Hash trong DB:', admin.password);
      const match = await bcrypt.compare('admin1234', admin.password);
      console.log('  So sánh kết quả:', match ? '✅ ĐÚNG' : '❌ SAI');
    }

    console.log('\n=== TEST LOGIN với vana@gmail.com / 123456789 ===');
    const vana = await coll.findOne({ email: 'vana@gmail.com' });
    if (!vana) {
      console.log('Không tìm thấy user vana@gmail.com');
    } else {
      console.log('Tìm thấy user:', { email: vana.email, username: vana.username, role: vana.role });
      const match = await bcrypt.compare('123456789', vana.password);
      console.log('  So sánh kết quả:', match ? '✅ ĐÚNG' : '❌ SAI');
    }

    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

checkUsers();
