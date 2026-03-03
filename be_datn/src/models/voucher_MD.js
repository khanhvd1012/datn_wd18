import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    discount_type: {
        type: String,
        enum: ['percentage', 'fixed_amount'],
        required: true
    },
    discount_value: {
        type: Number,
        required: true,
        min: 0
    },
    min_order_amount: {
        type: Number, // Giá trị đơn hàng tối thiểu để áp dụng voucher
        default: 0,
        min: 0
    },
    max_discount_amount: {
        type: Number, // Giảm giá tối đa (cho percentage)
        default: null
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    usage_limit: {
        type: Number, // Tổng số lần sử dụng tối đa
        default: null // null = không giới hạn
    },
    used_count: {
        type: Number,
        default: 0,
        min: 0
    },
    user_limit: {
        type: Number, // Số lần mỗi user có thể sử dụng
        default: 1,
        min: 1
    },
    applicable_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }],
    applicable_categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }],
    applicable_brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Tự động cập nhật status dựa trên ngày và số lần sử dụng
voucherSchema.pre('save', function(next) {
    const now = new Date();
    
    if (this.end_date < now) {
        this.status = 'expired';
    } else if (this.usage_limit && this.used_count >= this.usage_limit) {
        this.status = 'inactive';
    } else if (this.status === 'expired' && this.end_date >= now && 
               (!this.usage_limit || this.used_count < this.usage_limit)) {
        this.status = 'active';
    }
    
    next();
});

// Index để tìm kiếm nhanh
voucherSchema.index({ code: 1 });
voucherSchema.index({ status: 1 });
voucherSchema.index({ start_date: 1, end_date: 1 });

const Voucher = mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);
export default Voucher;
