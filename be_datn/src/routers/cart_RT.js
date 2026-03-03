import express from "express";
import {
    addToCart,
    getCart,
    removeCartItem,
    updateCartItem,
    clearCart,
    restoreCartItem // Import tính năng restore
} from "../controllers/cart_CTL.js";
import { checkPermission } from "../middleware/checkPermission.js";

const cartRouter = express.Router();

// Tất cả API Cart đều cần Login
cartRouter.use(checkPermission);

cartRouter.get("/", getCart);
cartRouter.post("/add", addToCart);
cartRouter.put("/update/:id", updateCartItem);
cartRouter.delete("/remove/:id", removeCartItem);
cartRouter.delete("/clear", clearCart);
cartRouter.patch("/restore/:id", restoreCartItem); // API khôi phục

export default cartRouter;
