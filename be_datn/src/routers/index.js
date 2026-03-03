import { Router } from "express";

import bannerRouter from "./banner_RT.js";
import newsRouter from "./news_RT.js";
import contactRouter from "./contact_RT.js";
import brandRouter from "./brand_RT.js";
import authRouter from "./auth_RT.js";
import cartRouter from "./cart_RT.js";
import dashboardRouter from "./dashboard_RT.js";
import stockRouter from "./stock_RT.js";
import voucherRouter from "./voucher_RT.js";
import categoryRouter from "./category_RT.js";
const router = Router();

router.use("/banners", bannerRouter);
router.use("/news", newsRouter);
router.use("/contacts", contactRouter);
router.use("/brands", brandRouter);
router.use("/categories", categoryRouter);
router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/dashboard", dashboardRouter);
router.use("/stocks", stockRouter);
router.use("/vouchers", voucherRouter);

export default router;
