import { useState, ChangeEvent } from "react";
import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

type Product = {
  name: string;
  price: number;
  url: string;
};

type Message = {
  role: "user" | "ai";
  text: string;
  products?: Product[];
};

export default function AiChatWidget() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        text: data.message || data.reply || "Không có phản hồi",
        products: data.products || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Lỗi kết nối đến AI server.",
        },
      ]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      {/* Floating Button */}
<IconButton
  onClick={() => setOpen(!open)}
  sx={{
    position: "fixed",
    bottom: 20,
    right: 40,
    width: 70,
    height: 70,
    zIndex: 9999,
    p: 0,
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: 3,
    "&:hover": {
      transform: "scale(1.1)",
    },
  }}
>
  <img
    src="https://png.pngtree.com/png-clipart/20240310/original/pngtree-little-cute-robot-funny-virtual-assistant-bot-png-image_14551911.png"
    alt="AI Assistant"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
</IconButton>

      {/* Chat Box */}
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 20,
            width: 320,
            height: 420,
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#126bc4",
              color: "white",
              p: 1,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            🤖 Trợ lý AI
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              p: 1,
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
            }}
          >
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                {/* Text */}
                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <b>{msg.role === "user" ? "Bạn" : "AI"}:</b> {msg.text}
                </Typography>

                {/* 🛒 PRODUCT CARDS */}
                {msg.products && msg.products.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {msg.products.map((p, i) => (
                      <Paper
                        key={i}
                        sx={{
                          p: 1,
                          mb: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography fontSize={14}>
                            {p.name}
                          </Typography>
                          <Typography fontSize={12} color="gray">
                            {p.price.toLocaleString()} VND
                          </Typography>
                        </Box>

                        <a href={p.url}>
                          <button
                            style={{
                              background: "#1976d2",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: 5,
                              cursor: "pointer",
                            }}
                          >
                            Xem
                          </button>
                        </a>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box sx={{ display: "flex", p: 1 }}>
            <TextField
              size="small"
              fullWidth
              value={input}
              onChange={handleInputChange}
              placeholder="Hỏi gì đó..."
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: 8,
                background: "#1976d2",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Gửi
            </button>
          </Box>
        </Paper>
      )}
    </>
  );
}