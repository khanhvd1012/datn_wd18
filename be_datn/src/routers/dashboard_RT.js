import { Router } from "express";
import { 
    getDashboardStats, 
    getStockDashboard, 
    getVoucherDashboard 
} from "../controllers/dashboard_CTL.js";
import { checkPermission, checkRole } from "../middleware/checkPermission.js";
import { ROLES } from "../config/roles.js";

const dashboardRouter = Router();

dashboardRouter.use(checkPermission, checkRole([ROLES.ADMIN]));

dashboardRouter.get("/", getDashboardStats);
dashboardRouter.get("/stock", getStockDashboard);
dashboardRouter.get("/voucher", getVoucherDashboard);

export default dashboardRouter;
