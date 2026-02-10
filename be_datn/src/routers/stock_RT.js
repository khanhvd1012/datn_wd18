import { Router } from "express";
import {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock,
    updateStockQuantity,
    reserveStock
} from "../controllers/stock_CTL.js";
import {
    validateStock,
    validateUpdateQuantity,
    validateReserveStock
} from "../validators/stock_VLD.js";
import { checkPermission } from "../middleware/checkPermission.js";
const stockRouter = Router();

stockRouter.get("/",checkPermission ,getAllStocks);
stockRouter.get("/:id", checkPermission,getStockById);
stockRouter.post("/", checkPermission,validateStock, createStock);
stockRouter.put("/:id", checkPermission,validateStock, updateStock);
stockRouter.delete("/:id", checkPermission,deleteStock);
stockRouter.put("/:id/quantity", checkPermission,validateUpdateQuantity, updateStockQuantity);
stockRouter.put("/:id/reserve", checkPermission,validateReserveStock, reserveStock);

export default stockRouter;
