import { Router } from "express";
import {
    getAllVariants,
    getVariantsByProduct,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant
} from "../controllers/variant_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";
import upload from "../middleware/upload_MID.js";

const variantRouter = Router();

// Public routes
variantRouter.get("/product/:productId", getVariantsByProduct);
variantRouter.get("/:id", getVariantById);

// Admin routes (cần permission)
variantRouter.get("/", checkPermission, getAllVariants);
variantRouter.post("/", upload.array("images", 10), checkPermission, createVariant);
variantRouter.put("/:id", upload.array("images", 10), checkPermission, updateVariant);
variantRouter.delete("/:id", checkPermission, deleteVariant);

export default variantRouter;
