import { Router } from "express";

import bannerRouter from "./banner_RT.js";
import newsRouter from "./news_RT.js";
import contactRouter from "./contact_RT.js";
import brandRouter from "./brand_RT.js";
import authRouter from "./auth_RT.js";
import cartRouter from "./cart_RT.js";
const router = Router();


router.use("/banners", bannerRouter);
router.use("/news", newsRouter);
router.use("/contacts", contactRouter)
router.use("/brands", brandRouter);
router.use("/auth", authRouter);
router.use("/cart", cartRouter);

export default router;
