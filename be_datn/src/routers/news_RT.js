import { Router } from "express";
import upload from "../middleware/upload_MID.js";
import { createNews, deleteNews, getAllNews, getNewsById, updateNews } from "../controllers/news_CTL.js";
import { validateNews } from "../validators/news_VLD.js";
import { checkPermission } from "../middleware/checkPermission.js";
const newsRouter = Router();

newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getNewsById);
newsRouter.post("/", upload.array("images", 5), validateNews,checkPermission, createNews);
newsRouter.put("/:id", upload.array("images", 5), validateNews,checkPermission, updateNews);
newsRouter.delete("/:id", deleteNews);

export default newsRouter;