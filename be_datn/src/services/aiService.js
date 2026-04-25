import Groq from "groq-sdk";
import { findProducts } from "./productSearch.js";


console.log("GROQ KEY:", process.env.GROQ_API_KEY); // 

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const handleChat = async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    //  STEP 1: Find products
    const products = await findProducts(message);

    //  STEP 2: Build product context
    const productText = products.length
      ? products
          .map(
            (p) =>
              `- ${p.name} | Giá: ${p.price} VND | Link: ${p.url}`
          )
          .join("\n")
      : "Không có sản phẩm phù hợp.";

    //  STEP 3: AI response
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Bạn là trợ lý AI bán hàng cho website phụ kiện điện thoại.

QUY TẮC:
- Luôn trả lời bằng tiếng Việt
- Ngắn gọn, dễ hiểu
- Nếu có sản phẩm → giới thiệu rõ ràng + khuyên dùng
- Nếu KHÔNG có → nói: "Hiện tại cửa hàng chưa có sản phẩm này"
Nếu có sản phẩm:
- Luôn gửi kèm link sản phẩm cho khách
DANH SÁCH SẢN PHẨM:
${productText}
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      message: response.choices[0].message.content,
      products,
    });
  } catch (error) {
    console.error("❌ AI error:", error);
    res.status(500).json({ error: error.message });
  }
};