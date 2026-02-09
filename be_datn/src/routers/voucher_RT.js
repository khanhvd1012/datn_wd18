import { Router } from "express";
import {
    getAllVouchers,
    getVoucherById,
    getVoucherByCode,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    useVoucher,
    toggleVoucherStatus
} from "../controllers/voucher_CTL.js";
import { validateVoucher } from "../validators/voucher_VLD.js";

const voucherRouter = Router();

voucherRouter.get("/", getAllVouchers);
voucherRouter.get("/code/:code", getVoucherByCode);
voucherRouter.get("/:id", getVoucherById);
voucherRouter.post("/", validateVoucher, createVoucher);
voucherRouter.put("/:id", validateVoucher, updateVoucher);
voucherRouter.delete("/:id", deleteVoucher);
voucherRouter.put("/:id/use", useVoucher);
voucherRouter.put("/:id/toggle-status", toggleVoucherStatus);

export default voucherRouter;
