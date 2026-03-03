import { Router } from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "../controllers/category_CTL.js";
import { validateCategory } from "../validators/category_VLD.js";
import upload from "../middleware/upload_MID.js";
import { checkPermission } from "../middleware/checkPermission.js";

const categoryRouter = Router();

// router kcan dnhap
categoryRouter.get("/", getAllCategories);
// categoryRouter.get("/:id", getCategoryById);

// có check role và dnhap
categoryRouter.post("/",
    checkPermission,
    upload.single("logo_image"),
    validateCategory,
    createCategory);
categoryRouter.put("/:id",
   checkPermission,
    upload.single("logo_image"),
    validateCategory,
    updateCategory);
categoryRouter.delete("/:id",
   checkPermission,
    deleteCategory);

export default categoryRouter;