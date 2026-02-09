import { Router } from "express";
import { 
    getDashboardStats, 
    getStockDashboard, 
    getVoucherDashboard 
} from "../controllers/dashboard_CTL.js";

const dashboardRouter = Router();

dashboardRouter.get("/", getDashboardStats);
dashboardRouter.get("/stock", getStockDashboard);
dashboardRouter.get("/voucher", getVoucherDashboard);

export default dashboardRouter;
