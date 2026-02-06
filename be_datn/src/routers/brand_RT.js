import { Router } from "express";
import { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand } from "../controllers/brand_CTL";
import { validateBrand } from "../validators/brand_VLD";
import upload from "../middleware/upload_MID";

const brandRouter = Router();


brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);

brandRouter.post("/",
    upload.single("logo_image"),
    validateBrand,
    createBrand);
brandRouter.put("/:id",
    upload.single("logo_image"),
    validateBrand,
    updateBrand);
brandRouter.delete("/:id",
    deleteBrand);

export default brandRouter;