import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import router from "./src/routers/index.js";

import Groq from "groq-sdk";


dotenv.config();

const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));

app.use("/api", router);

// ===================== ROOT ROUTE =====================
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// =====================  AI SETUP =====================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

//  NEW: AI CHAT API
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        error: "message is required",
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
        role: "system",
        content: `
      Bạn là một trợ lý AI bán hàng cho cửa hàng phụ kiện điện thoại tại Việt Nam.

      QUY TẮC:
      - Luôn trả lời bằng TIẾNG VIỆT
      - Giọng thân thiện, tự nhiên như nhân viên tư vấn
      - Ngắn gọn, dễ hiểu
      - Nếu có sản phẩm → giới thiệu sản phẩm rõ ràng (tên, giá, công dụng)
      - Nếu không có thông tin → nói sẽ kiểm tra giúp khách hàng

      Không trả lời bằng tiếng Anh.
        `
      },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ Groq error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===================== START SERVER =====================
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🤖 AI Chat available at /api/chat`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { app };