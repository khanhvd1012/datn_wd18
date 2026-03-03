import mongoose from "mongoose";
import { ROLES } from "../config/roles.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
        },
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/davdn1j86/image/upload/v1732163937/datn/653308_p0u3co.png",
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
