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

const stockRouter = Router();

stockRouter.get("/", getAllStocks);
stockRouter.get("/:id", getStockById);
stockRouter.post("/", validateStock, createStock);
stockRouter.put("/:id", validateStock, updateStock);
stockRouter.delete("/:id", deleteStock);
stockRouter.put("/:id/quantity", validateUpdateQuantity, updateStockQuantity);
stockRouter.put("/:id/reserve", validateReserveStock, reserveStock);

export default stockRouter;
