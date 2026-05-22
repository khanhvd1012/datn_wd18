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
import { checkPermission } from "../middleware/checkPermission.js";
const voucherRouter = Router();

// Public: khách hàng kiểm tra mã giảm giá tại trang thanh toán
voucherRouter.get("/check/:code", getVoucherByCode);

// Public: khách hàng lấy danh sách mã giảm giá hợp lệ
import { getPublicVouchers } from "../controllers/voucher_CTL.js";
voucherRouter.get("/public", getPublicVouchers);

// Protected admin routes
voucherRouter.get("/", checkPermission, getAllVouchers);
voucherRouter.get("/code/:code", checkPermission, getVoucherByCode);
voucherRouter.get("/:id", checkPermission, getVoucherById);
voucherRouter.post("/", checkPermission, validateVoucher, createVoucher);
voucherRouter.put("/:id", checkPermission, validateVoucher, updateVoucher);
voucherRouter.delete("/:id", checkPermission, deleteVoucher);
voucherRouter.put("/:id/use", checkPermission, useVoucher);
voucherRouter.put("/:id/toggle-status", checkPermission, toggleVoucherStatus);

export default voucherRouter;
