import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    order_items: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },

        variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
            default: null
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        image: {
            type: String,
            default: ""
        }
    }],

    return_status: {
        type: String,
        enum: [
            "none",
            "requested",
            "approved",
            "rejected",
            "refunded"
        ],
        default: "none"
    },

    shipping_info: {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        }
    },

    payment_method: {
        type: String,
        enum: ['cod', 'bank', 'momo', 'vnpay'],
        default: 'cod'
    },

    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },

    order_status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'processing',
            'shipping',
            'delivered',
            'received',
            'cancelled'
        ],
        default: 'pending'
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },

    shipping_fee: {
        type: Number,
        default: 0,
        min: 0
    },

    discount: {
        type: Number,
        default: 0,
        min: 0
    },

    coupon_discount: {
        type: Number,
        default: 0,
        min: 0
    },

    total: {
        type: Number,
        required: true,
        min: 0
    },

    coupon_code: {
        type: String,
        default: null
    },

    notes: {
        type: String,
        default: ""
    },
    return_requested: {
    type: Boolean,
    default: false
},

return_status: {
    type: String,
    enum: [
        "none",
        "requested",
        "approved",
        "rejected",
        "refunded"
    ],
    default: "none"
},

    stock_deducted: {
        type: Boolean,
        default: false
    },

    cancel_reason: {
        type: String,
        default: ""
    },

    delivery_proof_images: [{
        type: String
    }],

    delivered_at: {
        type: Date,
        default: null
    },

    confirmation_deadline_at: {
        type: Date,
        default: null
    },

    customer_confirmed_received: {
        type: Boolean,
        default: false
    },

    confirmed_received_at: {
        type: Date,
        default: null
    },

    confirmed_received_by: {
        type: String,
        enum: ["user", "auto", null],
        default: null
    },

    delivery_rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },

    delivery_feedback: {
        type: String,
        default: ""
    }

}, {
    timestamps: true,
    versionKey: false
});

// Index để tìm kiếm nhanh
orderSchema.index({ user_id: 1 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ payment_status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);