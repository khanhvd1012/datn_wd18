import { Router } from "express";
import { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand } from "../controllers/brand_CTL.js";
import { validateBrand } from "../validators/brand_VLD.js";
import upload from "../middleware/upload_MID.js";
import { checkPermission } from "../middleware/checkPermission.js";
const brandRouter = Router();


brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);

brandRouter.post("/",
    checkPermission,
    upload.single("logo_image"),
    validateBrand,
    createBrand);
brandRouter.put("/:id",
    checkPermission,
    upload.single("logo_image"),
    validateBrand,
    updateBrand);
brandRouter.delete("/:id",
    checkPermission,
    deleteBrand);

export default brandRouter;