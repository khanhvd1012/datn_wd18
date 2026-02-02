import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brands"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    },
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant"
    }],
    slug: { type: String, required: true, unique: true }
}, { timestamps: true });

// Plugin hỗ trợ phân trang
productSchema.plugin(mongoosePaginate);

export default mongoose.models.Products || mongoose.model("Products", productSchema);
