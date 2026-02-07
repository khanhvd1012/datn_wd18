import { Router } from "express";
import upload from "../middleware/upload_MID.js";
import { createNews, deleteNews, getAllNews, getNewsById, updateNews } from "../controllers/news_CTL.js";
import { validateNews } from "../validators/news_VLD.js";

const newsRouter = Router();

newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getNewsById);
newsRouter.post("/", upload.array("images", 5), validateNews, createNews);
newsRouter.put("/:id", upload.array("images", 5), validateNews, updateNews);
newsRouter.delete("/:id", deleteNews);

export default newsRouter;