import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Product from '../src/models/product_MD.js';
import User from '../src/models/user_MD.js';
import Cart from '../src/models/cart_MD.js';
import CartItem from '../src/models/cartItem_MD.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const addAllProductsToAllCarts = async () => {
    try {
        await connectDB();

        const products = await Product.find({ is_active: true });
        console.log(`Found ${products.length} active products.`);

        if (products.length === 0) {
            console.log('No products found to add.');
            process.exit(0);
        }

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            let cart = await Cart.findOne({ user_id: user._id });
            if (!cart) {
                cart = await Cart.create({ user_id: user._id });
                console.log(`Created new cart for user ${user.username}`);
            }

            // Xoá giỏ hàng cũ để add mới cho sạch
            await CartItem.deleteMany({ cart_id: cart._id });

            const cartItemsToInsert = products.map(product => {
                let variantId = null;
                if (product.variants && product.variants.length > 0) {
                    variantId = product.variants[0]._id;
                }
                return {
                    cart_id: cart._id,
                    product_id: product._id,
                    variant_id: variantId,
                    quantity: 1,
                    price: product.price
                };
            });

            await CartItem.insertMany(cartItemsToInsert);
            console.log(`Added ${cartItemsToInsert.length} products to cart of user ${user.username}`);
        }

        console.log('Successfully added all products to all carts!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding products to carts:', error);
        process.exit(1);
    }
};

addAllProductsToAllCarts();
