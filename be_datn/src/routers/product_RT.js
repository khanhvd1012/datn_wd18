import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product_CTL.js";
import { validateProduct } from "../validators/product_VLD.js";
import upload from "../middleware/upload_MID.js";

const productRouter = Router();

// Public routes - không cần đăng nhập
productRouter.get("/", getAllProducts);
productRouter.get("/slug/:slug", getProductBySlug);
productRouter.get("/:id", getProductById);

// Protected routes - cần đăng nhập (có thể thêm middleware checkPermission sau)
productRouter.post(
    "/",
    upload.array("images", 10), // Cho phép upload tối đa 10 ảnh
    validateProduct,
    createProduct
);

productRouter.put(
    "/:id",
    upload.array("images", 10),
    validateProduct,
    updateProduct
);

productRouter.delete("/:id", deleteProduct);

export default productRouter;
