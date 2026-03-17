import { Router } from "express";
import { createContact, deleteContact, getAllContacts } from "../controllers/contact_CTL.js";
import { validateContact } from "../validators/contact_VLD.js";
import { checkPermission } from "../middleware/checkPermission.js";
const contactRouter = Router();

// Gửi liên hệ: không cần đăng nhập
contactRouter.post("/", validateContact, createContact);
// Quản lý liên hệ chỉ admin
contactRouter.get("/", checkPermission, getAllContacts);
contactRouter.delete("/:id", checkPermission, deleteContact);

export default contactRouter;
