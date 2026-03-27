import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Breadcrumbs,
  Link,
  Stack,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";

import { Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const navigate = useNavigate();

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      const mappedCart = res.data.map((item: any) => ({
        ...item,
        id: item._id || item.id
      }));
      setCart(mappedCart);
    } catch (err) {
      console.error("Lỗi load cart:", err);
      showSnackbar("Không thể tải giỏ hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const updateQuantity = async (id: any, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await api.patch(`/cart/${id}`, {
        quantity: newQuantity
      });

      setCart(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      showSnackbar("Không thể cập nhật số lượng", "error");
    }
  };

  // REMOVE ITEM
  const removeItem = async (id: any) => {
    try {
      await api.delete(`/cart/${id}`);

      setCart(prev =>
        prev.filter(item => item.id !== id)
      );

      window.dispatchEvent(new Event("cartUpdated"));
      showSnackbar("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      showSnackbar("Không thể xóa sản phẩm", "error");
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    if (cart.length === 0) return;
    
    try {
      await Promise.all(
        cart.map(item => api.delete(`/cart/${item.id}`))
      );
      setCart([]);
      window.dispatchEvent(new Event("cartUpdated"));
      showSnackbar("Đã xóa toàn bộ giỏ hàng");
    } catch (err) {
      console.error("Lỗi xóa giỏ hàng:", err);
      showSnackbar("Không thể xóa giỏ hàng", "error");
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 5 }}>
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

      {/* TITLE */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Giỏ hàng của bạn ({cart.length} sản phẩm)
        </Typography>
        
        {cart.length > 0 && (
          <Button 
            color="error" 
            onClick={clearCart}
            startIcon={<Trash2 size={18} />}
          >
            Xóa tất cả
          </Button>
        )}
      </Box>

      {loading ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
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
          <ShoppingCart size={64} color="#ccc" style={{ marginBottom: 16 }} />
          <Typography variant="h6" mb={2}>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            sx={{
              background: "#d70018",
              fontWeight: 600,
              "&:hover": { background: "#b71c1c" }
            }}
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      ) : (
        <>
          {/* PRODUCT LIST */}
          <Paper
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb"
            }}
          >
            {cart.map((item, index) => (
              <Box key={item.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3
                  }}
                >
                  {/* PRODUCT */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      flex: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        background: "#f9fafb",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #eee",
                        cursor: "pointer"
                      }}
                      onClick={() => navigate(`/product/${item.productId || item.product_id}`)}
                    >
                      <img
                        src={item.img || "https://via.placeholder.com/70x70?text=No+Image"}
                        alt={item.name}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "contain"
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        fontWeight={600}
                        sx={{ 
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" }
                        }}
                        onClick={() => navigate(`/product/${item.productId || item.product_id}`)}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#d70018",
                          fontWeight: "bold",
                          mt: 1
                        }}
                      >
                        {formatPrice(item.price || 0)}
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
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </IconButton>

                    <Typography sx={{ px: 2, minWidth: 30, textAlign: "center" }}>
                      {item.quantity}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={16} />
                    </IconButton>
                  </Box>

                  {/* SUBTOTAL */}
                  <Box sx={{ minWidth: 120, textAlign: "right", px: 3 }}>
                    <Typography fontWeight="bold" color="#d70018">
                      {formatPrice((item.price || 0) * (item.quantity || 0))}
                    </Typography>
                  </Box>

                  {/* REMOVE */}
                  <IconButton
                    sx={{ color: "#d70018" }}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>

                {index !== cart.length - 1 && <Divider />}
              </Box>
            ))}
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
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Tạm tính:</Typography>
                <Typography>{formatPrice(totalPrice)}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Phí vận chuyển:</Typography>
                <Typography color="success.main">Miễn phí</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color="#d70018"
                >
                  {formatPrice(totalPrice)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{
                  background: "#d70018",
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: "bold",
                  "&:hover": { background: "#b71c1c" }
                }}
                onClick={() => navigate("/checkout")}
              >
                Tiến hành thanh toán
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                startIcon={<ArrowLeft />}
              >
                Tiếp tục mua sắm
              </Button>
            </Stack>
          </Paper>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
