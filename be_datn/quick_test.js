import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log('🔍 KIỂM TRA BACKEND VÀ MONGODB\n');

// 1. Kiểm tra file .env
console.log('1️⃣ Kiểm tra file .env...');
if (fs.existsSync('.env')) {
    console.log('   ✅ File .env tồn tại');
    if (process.env.MONGO_URI) {
        console.log('   ✅ MONGO_URI đã được set');
        // Ẩn password
        const uri = process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@');
        console.log('   📝 Connection string:', uri);
    } else {
        console.log('   ❌ MONGO_URI chưa được set');
    }
} else {
    console.log('   ❌ File .env không tồn tại');
}

// 2. Kiểm tra backend
console.log('\n2️⃣ Kiểm tra backend...');
try {
    const response = await axios.get('http://localhost:3000/', { timeout: 3000 });
    console.log('   ✅ Backend đang chạy');
    console.log('   📝 Response:', response.data);
} catch (error) {
    if (error.code === 'ECONNREFUSED') {
        console.log('   ❌ Backend chưa chạy');
        console.log('   💡 Chạy: npm run dev');
    } else {
        console.log('   ❌ Lỗi:', error.message);
    }
}

// 3. Kiểm tra MongoDB (qua API)
console.log('\n3️⃣ Kiểm tra MongoDB (qua API)...');
try {
    const response = await axios.get('http://localhost:3000/api/products', { timeout: 3000 });
    console.log('   ✅ MongoDB đã kết nối');
    console.log('   📝 Số sản phẩm:', response.data?.length || 0);
} catch (error) {
    if (error.response?.status === 500) {
        console.log('   ❌ MongoDB chưa kết nối hoặc lỗi');
    } else if (error.code === 'ECONNREFUSED') {
        console.log('   ❌ Backend chưa chạy');
    } else {
        console.log('   ⚠️  API chưa sẵn sàng hoặc cần authentication');
        console.log('   📝 Status:', error.response?.status || error.code);
    }
}

console.log('\n✅ Hoàn thành kiểm tra!');
