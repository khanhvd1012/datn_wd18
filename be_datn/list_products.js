import mongoose from 'mongoose';

import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';

dotenv.config();

const listProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const products = await Product.find()
            .select('_id name images slug')
            .sort({ createdAt: -1 })
            .limit(50);

        if (products.length === 0) {
            console.log('📦 Chưa có sản phẩm nào');
            await mongoose.disconnect();
            return;
        }

        console.log(`📦 Tìm thấy ${products.length} sản phẩm:\n`);

        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   ID: ${product._id}`);
            console.log(`   Slug: ${product.slug}`);
            console.log(`   Ảnh: ${product.images?.length || 0} ảnh`);
            if (product.images && product.images.length > 0) {
                console.log(`   Ảnh đầu: ${product.images[0]}`);
            }
            console.log('');
        });

        console.log('\n💡 Để cập nhật ảnh, dùng lệnh:');
        console.log('   node update_image_url.js PRODUCT_ID URL1 URL2 ...');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listProducts();
