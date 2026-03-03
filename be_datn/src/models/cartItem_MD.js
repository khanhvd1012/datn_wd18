import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Soft delete middleware (optional but recommended for find queries)
// cartItemSchema.pre(/^find/, function(next) {
//     this.find({ deletedAt: null });
//     next();
// });

const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
export default CartItem;
