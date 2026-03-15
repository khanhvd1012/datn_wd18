import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';
import Variant from './src/models/variant_MD.js';

dotenv.config();

const checkAndFixStock = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Lấy tất cả products
        const products = await Product.find({});
        console.log(`📦 Tổng số sản phẩm: ${products.length}\n`);

        let fixedCount = 0;

        for (const product of products) {
            // Kiểm tra product có variants không
            const variants = await Variant.find({ product: product._id });
            
            if (variants.length > 0) {
                // Nếu có variants, kiểm tra stock của từng variant
                console.log(`\n📦 Sản phẩm: ${product.name}`);
                console.log(`   Product stock: ${product.countInStock || 0}`);
                
                for (const variant of variants) {
                    console.log(`   Variant "${variant.name}": stock = ${variant.stock !== undefined ? variant.stock : 'chưa set'}`);
                    
                    // Nếu variant không có stock hoặc stock = 0, set stock từ product
                    if (variant.stock === undefined || variant.stock === null || variant.stock === 0) {
                        if (product.countInStock > 0) {
                            await Variant.findByIdAndUpdate(variant._id, {
                                stock: product.countInStock
                            });
                            console.log(`   ✅ Đã cập nhật stock variant "${variant.name}" = ${product.countInStock}`);
                            fixedCount++;
                        } else {
                            // Nếu product cũng không có stock, set mặc định 100
                            await Variant.findByIdAndUpdate(variant._id, {
                                stock: 100
                            });
                            await Product.findByIdAndUpdate(product._id, {
                                countInStock: 100
                            });
                            console.log(`   ✅ Đã set stock mặc định = 100 cho variant "${variant.name}" và product`);
                            fixedCount += 2;
                        }
                    }
                }
            } else {
                // Nếu không có variants, kiểm tra stock của product
                if (!product.countInStock || product.countInStock === 0) {
                    await Product.findByIdAndUpdate(product._id, {
                        countInStock: 100
                    });
                    console.log(`✅ Đã set stock mặc định = 100 cho sản phẩm "${product.name}"`);
                    fixedCount++;
                }
            }
        }

        console.log(`\n✅ Hoàn thành! Đã cập nhật ${fixedCount} bản ghi stock.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

checkAndFixStock();
