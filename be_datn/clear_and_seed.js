import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';
import Variant from './src/models/variant_MD.js';
import Category from './src/models/category_MD.js';
import Brand from './src/models/brand_MD.js';

dotenv.config();

const clearAndSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Xóa tất cả variants và products
        console.log('🗑️  Đang xóa dữ liệu cũ...');
        await Variant.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Đã xóa dữ liệu cũ\n');

        // Import và chạy seed script
        console.log('🌱 Đang chạy seed script...\n');
        
        // Import seed function
        const { default: seedProductsWithVariants } = await import('./seed_products_with_variants.js');
        
        // Chạy seed
        await seedProductsWithVariants();

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

clearAndSeed();
