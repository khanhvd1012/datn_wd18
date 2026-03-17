import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        images: [{
            type: String,
            trim: true
        }],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'published'
        },
        views: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        tags: [{ type: String }],
        published_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("News", newsSchema);
