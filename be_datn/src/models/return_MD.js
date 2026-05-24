import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },

    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        default: null
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    price: {
        type: Number,
        required: true
    },

    reason_item: {
        type: String,
        default: ""
    }
});

const returnSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [returnItemSchema],

    reason: {
        type: String,
        required: true
    },

    images: [String],

    status: {
        type: String,
        enum: [
            "requested",
            "approved",
            "rejected",
            "received",
            "refunded",
            "completed"
        ],
        default: "requested"
    },

    refund_amount: {
        type: Number,
        default: 0
    },

    admin_note: {
        type: String,
        default: ""
    },

    refunded_at: Date

}, { timestamps: true });

export default mongoose.model("ReturnRequest", returnSchema);