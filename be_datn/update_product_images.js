import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';

dotenv.config();

const updateProductImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // ===== CÁCH 1: Cập nhật ảnh cho một sản phẩm cụ thể =====
        const productId = process.argv[2]; // Nhận ID từ command line
        
        if (!productId) {
            console.log('❌ Vui lòng cung cấp Product ID');
            console.log('Cách dùng: node update_product_images.js PRODUCT_ID');
            process.exit(1);
        }

        // Ảnh mới (có thể thay đổi)
        const newImages = [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
            'https://images.unsplash.com/photo-1518449037947-7d1b2c1f3a8b',
            'https://images.unsplash.com/photo-1580910051074-3eb694886505'
        ];

        const product = await Product.findById(productId);

        if (!product) {
            console.log('❌ Không tìm thấy sản phẩm');
            process.exit(1);
        }

        console.log(`📦 Sản phẩm: ${product.name}`);
        console.log(`📸 Ảnh cũ:`, product.images);

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { images: newImages },
            { new: true }
        );

        console.log(`✅ Cập nhật ảnh thành công!`);
        console.log(`📸 Ảnh mới:`, updatedProduct.images);

        // ===== CÁCH 2: Cập nhật tất cả sản phẩm (uncomment để dùng) =====
        /*
        const products = await Product.find();
        console.log(`📦 Tìm thấy ${products.length} sản phẩm`);
        
        for (const product of products) {
            const defaultImage = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab';
            await Product.findByIdAndUpdate(product._id, {
                images: product.images.length > 0 ? product.images : [defaultImage]
            });
            console.log(`✅ Updated ${product.name}`);
        }
        */

        await mongoose.disconnect();
        console.log('\n✅ Hoàn thành!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateProductImages();
