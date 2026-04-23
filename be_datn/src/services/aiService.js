import { findProducts } from "../services/productSearch.js";

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    //  STEP 1: Find products from DB
    const products = await findProducts(message);

    //  STEP 2: Send to AI
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Bạn là trợ lý AI bán hàng cho website phụ kiện điện thoại Việt Nam.

QUY TẮC:
- Trả lời tiếng Việt
- Ngắn gọn, dễ hiểu
- Luôn giới thiệu sản phẩm nếu có

DỮ LIỆU SẢN PHẨM:
${JSON.stringify(products)}
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
      products, // 👈 IMPORTANT: send to frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});