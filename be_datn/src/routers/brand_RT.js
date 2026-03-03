import { Router } from "express";
import { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand } from "../controllers/brand_CTL.js";
import { validateBrand } from "../validators/brand_VLD.js";
import upload from "../middleware/upload_MID.js";
import { checkPermission } from "../middleware/checkPermission.js";
const brandRouter = Router();


brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);

brandRouter.post("/",
    upload.single("logo_image"),
    validateBrand,
    checkPermission,
    createBrand);
brandRouter.put("/:id",
    upload.single("logo_image"),
    validateBrand,
    checkPermission,
    updateBrand);
brandRouter.delete("/:id",
    checkPermission,
    deleteBrand);

export default brandRouter;