import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Breadcrumbs,
  Link,
  Stack
} from "@mui/material";

import { Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.cart && response.data.cart.items) {
        setCart(response.data.cart.items);
      }
    } catch (error: any) {
      console.error("Error loading cart:", error);
      
      // Xử lý lỗi token hết hạn
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || "";
        if (errorMessage.includes("hết hạn") || errorMessage.includes("không hợp lệ")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }
      }
      
      alert("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCart(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      alert("Không thể cập nhật số lượng");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCart(prev => prev.filter(item => item._id !== itemId));
    } catch (error: any) {
      console.error("Error removing item:", error);
      alert("Không thể xóa sản phẩm");
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <Box sx={{ py: 5, background: "#f3f4f6", minHeight: "100vh" }}>

      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>

        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Link>
          <Typography>Giỏ hàng</Typography>
        </Breadcrumbs>

        <Typography variant="h5" fontWeight="bold" mb={3}>
          Giỏ hàng của bạn ({cart.length})
        </Typography>

        {loading ? (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #eee"
            }}
          >
            <Typography>Đang tải giỏ hàng...</Typography>
          </Paper>
        ) : cart.length === 0 ? (

          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #eee"
            }}
          >
            <Typography mb={2}>Giỏ hàng của bạn đang trống</Typography>

            <Button
              variant="contained"
              startIcon={<ArrowLeft />}
              sx={{
                background: "#d70018",
                fontWeight: 600
              }}
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>

          </Paper>

        ) : (

          <>
            {/* LIST PRODUCT */}
            <Paper
              sx={{
                borderRadius: 3,
                border: "1px solid #e5e7eb"
              }}
            >

              {cart.map((item: any, index: number) => {
                const productName = item.product_id?.name || "";
                const variantName = item.variant_id?.name || "";
                const displayName = variantName ? `${productName} - ${variantName}` : productName;
                const imageUrl = item.product_id?.images?.[0] || "";
                const itemPrice = item.price || 0;

                return (
                  <Box key={item._id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 3
                      }}
                    >
                      {/* PRODUCT */}
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Box
                          sx={{
                            width: 90,
                            height: 90,
                            background: "#f9fafb",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #eee"
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={displayName}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "contain"
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography fontWeight={600}>
                            {displayName}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#d70018",
                              fontWeight: "bold",
                              mt: 1
                            }}
                          >
                            {itemPrice.toLocaleString()}₫
                          </Typography>
                        </Box>
                      </Box>

                      {/* QUANTITY */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ddd",
                          borderRadius: 2
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </IconButton>

                        <Typography sx={{ px: 2 }}>
                          {item.quantity}
                        </Typography>

                        <IconButton
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </IconButton>
                      </Box>

                      {/* REMOVE */}
                      <IconButton
                        sx={{ color: "#d70018" }}
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>

                    {index !== cart.length - 1 && <Divider />}
                  </Box>
                );
              })}

            </Paper>

            {/* TOTAL */}
            <Paper
              sx={{
                mt: 4,
                p: 4,
                borderRadius: 3,
                border: "1px solid #e5e7eb"
              }}
            >

              <Typography variant="h6" mb={2}>
                Tổng thanh toán
              </Typography>

              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#d70018",
                  mb: 3
                }}
              >
                {totalPrice.toLocaleString()}₫
              </Typography>

              <Stack direction="row" spacing={2}>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                >
                  Tiếp tục mua
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    background: "#d70018",
                    px: 4,
                    fontWeight: "bold"
                  }}
                  onClick={() => navigate("/checkout")}
                >
                  Thanh toán
                </Button>

              </Stack>

            </Paper>

          </>
        )}

      </Box>

    </Box>
  );
};

export default Cart;