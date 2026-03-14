import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';
import Variant from './src/models/variant_MD.js';

dotenv.config();

const checkVariants = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Đếm tổng số variants
        const totalVariants = await Variant.countDocuments();
        console.log(`📊 Tổng số variants trong database: ${totalVariants}`);

        // Đếm tổng số products
        const totalProducts = await Product.countDocuments();
        console.log(`📦 Tổng số products trong database: ${totalProducts}\n`);

        if (totalVariants === 0) {
            console.log('❌ Chưa có biến thể sản phẩm nào trong database!');
            console.log('💡 Chạy script seed để tạo biến thể:');
            console.log('   node seed_products_with_variants.js\n');
        } else {
            console.log('✅ Đã có biến thể sản phẩm trong database!\n');
            
            // Hiển thị một số variants mẫu
            const variants = await Variant.find().limit(5).populate('product', 'name');
            console.log('📋 Một số variants mẫu:');
            variants.forEach((v, index) => {
                console.log(`${index + 1}. ${v.name} - Sản phẩm: ${v.product?.name || 'N/A'}`);
            });
        }

        // Kiểm tra products có variants
        const productsWithVariants = await Product.find({ 
            variants: { $exists: true, $ne: [] } 
        }).countDocuments();
        
        console.log(`\n📊 Số sản phẩm có biến thể: ${productsWithVariants}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

checkVariants();
