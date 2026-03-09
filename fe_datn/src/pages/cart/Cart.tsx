import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(`http://localhost:3000/cart/${id}`, {
        quantity: newQuantity,
      });

      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <Box sx={{ backgroundColor: "#f5f5f7", py: 4 }}>
      
      {/* GIỐNG HỆT PRODUCTLIST */}
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 2 }}>

        <Typography variant="h5" fontWeight={700} mb={3}>
          Giỏ hàng
        </Typography>

        {cart.length === 0 ? (
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6">Giỏ hàng trống</Typography>
          </Paper>
        ) : (
          <>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              {cart.map((item, index) => (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        component="img"
                        src={item.img}
                        sx={{
                          width: 90,
                          height: 90,
                          objectFit: "contain",
                          borderRadius: 2,
                          background: "#fafafa",
                          p: 1,
                        }}
                      />

                      <Box>
                        <Typography fontWeight={600}>
                          {item.name}
                        </Typography>
                        <Typography color="error" fontWeight={700}>
                          {Number(item.price).toLocaleString()}₫
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ddd",
                        borderRadius: 2,
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </IconButton>

                      <Typography sx={{ px: 2 }}>
                        {item.quantity}
                      </Typography>

                      <IconButton
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </IconButton>
                    </Box>

                    <IconButton onClick={() => removeItem(item.id)}>
                      <Trash2 color="red" />
                    </IconButton>
                  </Box>

                  {index !== cart.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>

            <Paper
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                textAlign: "right",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tổng tiền:{" "}
                <Box component="span" color="error.main" fontWeight={700}>
                  {totalPrice.toLocaleString()}₫
                </Box>
              </Typography>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#d70018",
                  px: 5,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#b80014",
                  },
                }}
                onClick={handleCheckout}
              >
                Thanh toán
              </Button>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Cart;