import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';

dotenv.config();

const updateImageUrl = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Lấy tham số từ command line
        const productId = process.argv[2];
        const imageUrls = process.argv.slice(3); // Tất cả các URL sau productId

        if (!productId) {
            console.log('❌ Vui lòng cung cấp Product ID và URL ảnh');
            console.log('\n📝 Cách dùng:');
            console.log('   node update_image_url.js PRODUCT_ID URL1 URL2 URL3 ...');
            console.log('\n💡 Ví dụ:');
            console.log('   node update_image_url.js 507f1f77bcf86cd799439011 https://example.com/img1.jpg https://example.com/img2.jpg');
            process.exit(1);
        }

        if (imageUrls.length === 0) {
            console.log('❌ Vui lòng cung cấp ít nhất 1 URL ảnh');
            process.exit(1);
        }

        // Tìm sản phẩm
        const product = await Product.findById(productId);

        if (!product) {
            console.log(`❌ Không tìm thấy sản phẩm với ID: ${productId}`);
            process.exit(1);
        }

        console.log(`📦 Sản phẩm: ${product.name}`);
        console.log(`📸 Ảnh cũ (${product.images?.length || 0} ảnh):`);
        if (product.images && product.images.length > 0) {
            product.images.forEach((img, index) => {
                console.log(`   ${index + 1}. ${img}`);
            });
        } else {
            console.log('   (Chưa có ảnh)');
        }

        // Cập nhật ảnh mới
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { images: imageUrls },
            { new: true }
        );

        console.log(`\n✅ Cập nhật ảnh thành công!`);
        console.log(`📸 Ảnh mới (${updatedProduct.images.length} ảnh):`);
        updatedProduct.images.forEach((img, index) => {
            console.log(`   ${index + 1}. ${img}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Hoàn thành!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.name === 'CastError') {
            console.error('💡 Product ID không hợp lệ');
        }
        process.exit(1);
    }
};

updateImageUrl();
