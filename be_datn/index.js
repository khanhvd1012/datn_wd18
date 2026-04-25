import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import router from "./src/routers/index.js";
import { handleChat } from "./src/services/aiService.js";


dotenv.config();

const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));

// ===================== ROUTES =====================
app.use("/api", router);

// ✅ USE AI ROUTE (THIS IS THE ONLY /api/chat NOW)
app.use("/api",handleChat );

// ===================== ROOT ROUTE =====================
app.get("/", (req, res) => {
  res.json({ status: "ok" });
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