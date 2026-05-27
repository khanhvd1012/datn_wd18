import express from "express";
import {
    createReturnRequest,
    updateReturnStatus,
    getAllReturns,
    approveReturn,
    rejectReturn
} from "../controllers/return_CTL.js";

import { checkPermission, checkRole } from "../middleware/checkPermission.js";
import { ROLES } from "../config/roles.js";
import upload from "../middleware/upload_MID.js";

const router = express.Router();

router.use(checkPermission);

// user
router.post("/", upload.array("return_images", 5), createReturnRequest);

// admin
router.get("/", checkRole([ROLES.ADMIN]), getAllReturns);
router.put("/:id/approve", checkRole([ROLES.ADMIN]), approveReturn);
router.put("/:id/reject", checkRole([ROLES.ADMIN]), rejectReturn);
router.put(  "/:id/status",   checkRole([ROLES.ADMIN]),  updateReturnStatus );
export default router;