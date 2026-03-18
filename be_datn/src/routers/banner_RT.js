import { Router } from "express";
import { createBanner, deleteBanner, getAllBanners, getBannerById, toggleBannerStatus, updateBanner } from "../controllers/banner_CTL.js";
import { validateBanner } from "../validators/banner_VLD.js";
import upload from "../middleware/upload_MID.js";
import { checkPermission } from "../middleware/checkPermission.js";
const bannerRouter = Router();

bannerRouter.get("/", getAllBanners);
bannerRouter.get("/:id", getBannerById);
bannerRouter.post("/", checkPermission, upload.single("image"), validateBanner, createBanner);
bannerRouter.put("/:id", checkPermission, upload.single("image"), validateBanner, updateBanner);
bannerRouter.delete("/:id",checkPermission , deleteBanner);
bannerRouter.put("/:id/toggle-status",checkPermission, toggleBannerStatus);

export default bannerRouter;