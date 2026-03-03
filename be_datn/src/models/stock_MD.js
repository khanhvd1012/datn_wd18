import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        required: false // Nếu sản phẩm có variant thì cần, không thì null
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    reserved_quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    location: {
        type: String, // Vị trí kho hàng
        required: false
    },
    min_stock_level: {
        type: Number, // Mức tồn kho tối thiểu để cảnh báo
        default: 10,
        min: 0
    },
    status: {
        type: String,
        enum: ['in_stock', 'low_stock', 'out_of_stock'],
        default: 'in_stock'
    },
    last_restocked: {
        type: Date
    },
    notes: {
        type: String
    }
}, { timestamps: true });

// Tính toán available quantity (số lượng có sẵn = quantity - reserved_quantity)
stockSchema.virtual('available_quantity').get(function() {
    return Math.max(0, this.quantity - this.reserved_quantity);
});

// Tự động cập nhật status dựa trên quantity
stockSchema.pre('save', function(next) {
    const available = this.quantity - this.reserved_quantity;
    
    if (available <= 0) {
        this.status = 'out_of_stock';
    } else if (available <= this.min_stock_level) {
        this.status = 'low_stock';
    } else {
        this.status = 'in_stock';
    }
    
    next();
});

// Index để tìm kiếm nhanh
stockSchema.index({ product: 1, variant: 1 }, { unique: true });
stockSchema.index({ status: 1 });

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);
export default Stock;
