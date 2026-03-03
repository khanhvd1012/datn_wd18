import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';

dotenv.config();

const seedProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const product = await Product.create({
            name: "iPhone 15 Pro Max",
            slug: "iphone-15-pro-max-" + Date.now(),
            price: 30000000,
            original_price: 35000000,
            description: "Điện thoại xịn nhất 2024",
            images: ["https://example.com/iphone15.jpg"],
            category_id: new mongoose.Types.ObjectId(), // Fake category ID
            brand_id: new mongoose.Types.ObjectId(), // Fake brand ID
            variants: [],
            countInStock: 100
        });

        console.log('Product created successfully');
        console.log('PRODUCT_ID:', product._id.toString());

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding product:', error);
        process.exit(1);
    }
};

seedProduct();
