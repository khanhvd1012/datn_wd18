import { Router } from "express";
import { createContact, deleteContact, getAllContacts } from "../controllers/contact_CTL.js";
import { validateContact } from "../validators/contact_VLD.js";

const contactRouter = Router();

// Gửi liên hệ: không bắt buộc phải đăng nhập
contactRouter.post("/",  validateContact, createContact);
contactRouter.get("/",  getAllContacts)
contactRouter.delete("/:id", deleteContact);

export default contactRouter;
