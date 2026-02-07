import { Router } from "express";
import { createBanner, deleteBanner, getAllBanners, getBannerById, toggleBannerStatus, updateBanner } from "../controllers/banner_CTL.js";
import { validateBanner } from "../validators/banner_VLD.js";
import upload from "../middleware/upload_MID.js";

const bannerRouter = Router();

bannerRouter.get("/", getAllBanners);
bannerRouter.get("/:id", getBannerById);
bannerRouter.post("/", upload.single("image"), validateBanner, createBanner);
bannerRouter.put("/:id", upload.single("image"), validateBanner, updateBanner);
bannerRouter.delete("/:id", deleteBanner);
bannerRouter.put("/:id/toggle-status", toggleBannerStatus);

export default bannerRouter;