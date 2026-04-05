import React, { useEffect, useState } from "react";
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
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Alert,
  Snackbar,
  Container,
  Chip,
  Tooltip,
} from "@mui/material";

import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../../services/cartService";
import type { CartItem } from "../../services/cartService";

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCartApi();
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setNotification({
        open: true,
        message: "Không thể tải giỏ hàng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItemApi(cartItemId, newQuantity);
      setCart((prev) =>
        prev.map((item) =>
          item._id === cartItemId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: (item.variant?.price || item.product.price) * newQuantity,
              }
            : item,
        ),
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      setNotification({
        open: true,
        message: "Không thể cập nhật số lượng",
        severity: "error",
      });
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await removeCartItemApi(cartItemId);
      setCart((prev) => prev.filter((item) => item._id !== cartItemId));
      window.dispatchEvent(new Event("cartUpdated"));
      setNotification({
        open: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng",
        severity: "success",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      setNotification({
        open: true,
        message: "Không thể xóa sản phẩm",
        severity: "error",
      });
    }
  };

  const clearAllItems = async () => {
    try {
      await clearCartApi();
      setCart([]);
      window.dispatchEvent(new Event("cartUpdated"));
      setNotification({
        open: true,
        message: "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
        severity: "success",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      setNotification({
        open: true,
        message: "Không thể xóa giỏ hàng",
        severity: "error",
      });
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const premiumFont = { fontFamily: "'Inter', system-ui, sans-serif" };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Đang tải giỏ hàng...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link
          color="inherit"
          href="/"
          sx={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
        >
          Trang chủ
        </Link>
        <Typography color="text.primary" fontWeight="600">Giỏ hàng</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
        <Typography variant="h3" fontWeight="700" sx={{ ...premiumFont, color: '#1a1a1a', letterSpacing: '-1px' }}>
          Giỏ hàng
          <Typography component="span" variant="h5" sx={{ ...premiumFont, ml: 2, color: 'text.secondary', fontWeight: 400 }}>
            ({getTotalItems()} sản phẩm)
          </Typography>
        </Typography>
      </Box>

      {cart.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: 8, bgcolor: '#f9f9f9', border: '2px dashed #eee' }}>
          <ShoppingBag size={80} style={{ color: "#ddd", marginBottom: 24 }} />
          <Typography variant="h4" fontWeight="800" sx={{ mb: 2 }}>
            Giỏ hàng đang trống!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá hàng ngàn sản phẩm hấp dẫn của chúng tôi nhé!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate("/products")}
            sx={{ 
                px: 6, 
                py: 2, 
                borderRadius: 4, 
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #1a1a1a 0%, #333 100%)'
            }}
          >
            Mua sắm ngay
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={5}>
          {/* Main Content: 2 Columns balanced */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {cart.map((item) => (
                <Card 
                  key={item._id} 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    borderRadius: 6, 
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                      borderColor: 'primary.light',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ bgcolor: '#fff', borderRadius: 4, p: 1, display: 'flex', justifyContent: 'center' }}>
                        <CardMedia
                          component="img"
                          image={
                            item.variant?.images?.[0] ||
                            item.product.images?.[0] ||
                            ""
                          }
                          alt={item.product.name}
                          sx={{
                            width: "auto",
                            maxWidth: '100%',
                            height: 140,
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                      <Typography variant="body1" fontWeight="700" sx={{ ...premiumFont, color: '#1a1a1a', lineHeight: 1.3, mb: 0.5, fontSize: '1rem' }}>
                        {item.product.name}
                      </Typography>
                      {item.variant?.name && (
                        <Chip 
                          label={`Phiên bản: ${item.variant.name}`}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 1, fontWeight: 500, borderRadius: 1.5, height: 22, fontSize: '0.7rem' }}
                        />
                      )}
                      <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ ...premiumFont }}>
                        {formatPrice(item.variant?.price || item.product.price)}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 2.5 }}>
                      <Box
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          bgcolor: '#f8f9fa', 
                          borderRadius: '16px',
                          p: '8px',
                          width: 'fit-content'
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#fff' }, boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
                        >
                          <Minus size={14} />
                        </IconButton>
                        <Typography sx={{ ...premiumFont, width: 40, textAlign: 'center', fontWeight: '800', fontSize: '1rem' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#fff' }, boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
                        >
                          <Plus size={14} />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 1.5 }}>
                      <Typography variant="body1" fontWeight="900" color="error.main" sx={{ ...premiumFont, textAlign: 'right' }}>
                        {formatPrice(item.totalPrice)}
                      </Typography>
                    </Grid>

                    <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
                      <Tooltip title="Xóa sản phẩm">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(item._id)}
                          sx={{ 
                            bgcolor: '#fff', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            '&:hover': { bgcolor: '#fff5f5', color: '#d70018', transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Card>
              ))}
            </Stack>

            <Box sx={{ mt: 5, display: "flex", gap: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate("/products")}
                sx={{ 
                  borderRadius: 4, 
                  px: 4, 
                  py: 1.5, 
                  fontWeight: '800', 
                  borderColor: '#eee', 
                  color: '#444',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#1a1a1a', bgcolor: 'transparent' }
                }}
              >
                Tiếp tục mua sắm
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Order Summary sticky */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3.5, 
                    position: "sticky", 
                    top: 100, 
                    borderRadius: 6, 
                    bgcolor: '#fff',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                }}
            >
              <Typography variant="h6" fontWeight="900" sx={{ ...premiumFont, mb: 3, letterSpacing: '-0.5px' }}>
                Tổng kết đơn hàng
              </Typography>

              <Stack spacing={3.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary" fontWeight="600" sx={{ ...premiumFont, fontSize: '1.1rem' }}>Tạm tính</Typography>
                  <Typography fontWeight="800" variant="h5" sx={{ ...premiumFont }}>{formatPrice(getTotalPrice())}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary" fontWeight="600" sx={{ ...premiumFont, fontSize: '1.1rem' }}>Giao hàng</Typography>
                  <Typography color="success.main" fontWeight="800" sx={{ ...premiumFont, fontSize: '1.1rem' }}>Miễn phí</Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="700" sx={{ ...premiumFont }}>Thành tiền</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight="900" color="error.main" sx={{ ...premiumFont, lineHeight: 1 }}>
                        {formatPrice(getTotalPrice())}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ...premiumFont, display: 'block', mt: 0.5, fontSize: '0.7rem' }}>(Đã bao gồm VAT)</Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate("/checkout")}
                  sx={{ 
                    mt: 3, 
                    py: 2.8, 
                    borderRadius: 5, 
                    fontWeight: "900",
                    fontSize: '1.3rem',
                    textTransform: 'none',
                    boxShadow: '0 15px 35px rgba(215, 0, 24, 0.3)',
                    background: 'linear-gradient(135deg, #d70018 0%, #ff4b2b 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b30014 0%, #e63e1f 100%)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(215, 0, 24, 0.4)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  Thanh toán ngay
                </Button>

                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    bgcolor: '#f5f5f5', 
                    borderRadius: 4, 
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" fontWeight="700" color="text.secondary" sx={{ ...premiumFont }}>
                    Nhập mã giảm giá ở bước thanh toán tiếp theo
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 'bold' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
