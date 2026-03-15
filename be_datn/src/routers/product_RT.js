import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";
import upload from "../middleware/upload_MID.js";

const productRouter = Router();

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Admin routes (cần permission)
// Hỗ trợ upload nhiều ảnh (tối đa 10 ảnh)
productRouter.post("/", upload.array("images", 10), checkPermission, createProduct);
productRouter.put("/:id", upload.array("images", 10), checkPermission, updateProduct);
productRouter.delete("/:id", checkPermission, deleteProduct);

export default productRouter;
