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

const variantRouter = Router();

// Public routes
variantRouter.get("/product/:productId", getVariantsByProduct);
variantRouter.get("/:id", getVariantById);

// Admin routes (cần permission)
variantRouter.get("/", checkPermission, getAllVariants);
variantRouter.post("/", checkPermission, createVariant);
variantRouter.put("/:id", checkPermission, updateVariant);
variantRouter.delete("/:id", checkPermission, deleteVariant);

export default variantRouter;
