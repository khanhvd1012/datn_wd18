import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    name: {
        type: String,
        required: true // Ví dụ: "Đỏ - 128GB", "Xanh - 256GB"
    },
    sku: {
        type: String,
        unique: true,
        sparse: true // Cho phép null nhưng nếu có thì phải unique
    },
    attributes: {
        // Lưu các thuộc tính của variant (màu sắc, kích thước, dung lượng, v.v.)
        type: Map,
        of: String,
        default: {}
        // Ví dụ: { "color": "Đỏ", "storage": "128GB", "size": "M" }
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: ''
    },
    storage: {
        type: String,
        default: ''
    },
    material: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    original_price: {
        type: Number,
        min: 0
    },
    images: [{
        type: String // URL hình ảnh của variant này
    }],
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_default: {
        type: Boolean,
        default: false // Variant mặc định của sản phẩm
    }
}, { timestamps: true });

// Index để tìm kiếm nhanh
variantSchema.index({ product: 1 });
variantSchema.index({ sku: 1 });
variantSchema.index({ is_active: 1 });

// Virtual để tính giá sau giảm
variantSchema.virtual('discount_price').get(function() {
    if (this.original_price && this.original_price > this.price) {
        return this.price;
    }
    return this.price;
});

// Virtual để tính phần trăm giảm giá
variantSchema.virtual('discount_percent').get(function() {
    if (this.original_price && this.original_price > this.price) {
        return Math.round(((this.original_price - this.price) / this.original_price) * 100);
    }
    return 0;
});

// Đảm bảo chỉ có một variant default cho mỗi product
variantSchema.pre('save', async function(next) {
    if (this.is_default) {
        await mongoose.model('Variant').updateMany(
            { product: this.product, _id: { $ne: this._id } },
            { $set: { is_default: false } }
        );
    }
    next();
});

const Variant = mongoose.models.Variant || mongoose.model("Variant", variantSchema);
export default Variant;
