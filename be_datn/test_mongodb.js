import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        console.log('Connection string:', process.env.MONGO_URI ? 'Đã có' : 'CHƯA CÓ');
        
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI chưa được set trong file .env');
        }
        
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        
        console.log('✅ MongoDB connected successfully!');
        console.log('Database name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        // Test query đơn giản
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📦 Collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Đã ngắt kết nối');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('not provided') || error.message.includes('chưa được set')) {
            console.error('\n💡 Giải pháp: Tạo file .env với MONGO_URI');
            console.error('   Ví dụ: MONGO_URI=mongodb://localhost:27017/datn_db');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('\n💡 Giải pháp: Start MongoDB service');
            console.error('   Windows: net start MongoDB');
        } else if (error.message.includes('Authentication')) {
            console.error('\n💡 Giải pháp: Kiểm tra username/password trong MONGO_URI');
        }
        
        process.exit(1);
    }
};

testConnection();
