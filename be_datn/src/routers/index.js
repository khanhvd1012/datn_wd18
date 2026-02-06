import { Router } from "express";

import bannerRouter from "./banner_RT";
import newsRouter from "./news_RT";
import contactRouter from "./contact_RT";
import brandRouter from "./brand_RT";
const router = Router();


router.use("/banners", bannerRouter);
router.use("/news", newsRouter);
router.use("/contacts", contactRouter)
router.use("/brands", brandRouter);

export default router;
