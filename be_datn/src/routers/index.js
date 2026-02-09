import { Router } from "express";

import bannerRouter from "./banner_RT";
import newsRouter from "./news_RT";
import contactRouter from "./contact_RT";
import brandRouter from "./brand_RT";
import dashboardRouter from "./dashboard_RT";
import stockRouter from "./stock_RT";
import voucherRouter from "./voucher_RT";

const router = Router();

router.use("/banners", bannerRouter);
router.use("/news", newsRouter);
router.use("/contacts", contactRouter);
router.use("/brands", brandRouter);
router.use("/dashboard", dashboardRouter);
router.use("/stocks", stockRouter);
router.use("/vouchers", voucherRouter);

export default router;
