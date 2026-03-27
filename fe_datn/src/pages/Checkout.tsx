import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Avatar,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  IconButton,
  Chip,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useNavigate } from "react-router-dom";

interface CartItem {
  _id?: string;
  id?: string;
  productId?: string;
  name: string;
  img?: string;
  price: number;
  quantity: number;
}

const steps = ["Giỏ hàng", "Thông tin giao hàng", "Thanh toán"];

const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const navigate = useNavigate();

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const mappedCart = (res.data || []).map((item: any) => ({
          ...item,
          id: item._id || item.id
        }));
        setCart(mappedCart);
      } catch (err) {
        console.error("Lỗi load cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Calculate totals
  const subTotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const shippingFee = subTotal >= 500000 ? 0 : 30000;
  const total = subTotal + shippingFee - couponDiscount;

  /* UPDATE QUANTITY */
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (newQuantity > 99) {
      showSnackbar("Số lượng tối đa là 99", "error");
      return;
    }

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

  /* REMOVE ITEM */
  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`);

      setCart(prev => prev.filter(item => item.id !== id));
      window.dispatchEvent(new Event("cartUpdated"));
      showSnackbar("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      showSnackbar("Không thể xóa sản phẩm", "error");
    }
  };

  /* APPLY COUPON */
  const applyCoupon = async () => {
    if (!couponCode) {
      showSnackbar("Nhập mã giảm giá", "error");
      return;
    }

    try {
      const res = await api.post("/vouchers/apply", { code: couponCode });
      if (res.data && res.data.discount) {
        setCouponDiscount(res.data.discount);
        showSnackbar("Áp dụng mã giảm giá thành công!");
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || "Mã không hợp lệ", "error");
    }
  };

  /* ORDER */
  const handleOrder = async () => {
    // Validation
    if (cart.length === 0) {
      showSnackbar("Giỏ hàng trống", "error");
      return;
    }

    if (!name.trim()) {
      showSnackbar("Nhập họ tên", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar("Email không hợp lệ", "error");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      showSnackbar("Số điện thoại không hợp lệ", "error");
      return;
    }

    if (!address.trim()) {
      showSnackbar("Nhập địa chỉ", "error");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        shipping_info: {
          name,
          email,
          phone,
          address
        },
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
        coupon_discount: couponDiscount,
        notes
      };

      const res = await api.post("/orders", orderData);

      // Clear cart on successful order
      await Promise.all(
        cart.map(item => api.delete(`/cart/${item.id}`))
      );
      window.dispatchEvent(new Event("cartUpdated"));

      // Navigate based on payment method
      if (paymentMethod === "cod") {
        navigate("/order-success", { state: { orderId: res.data._id } });
      } else {
        // For online payment, redirect to payment process
        navigate("/payment/process", { 
          state: { 
            orderId: res.data._id,
            paymentMethod 
          } 
        });
      }
    } catch (err: any) {
      console.error("Lỗi đặt hàng:", err);
      showSnackbar(err.response?.data?.message || "Không thể đặt hàng", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={3}
        >
          Thanh toán đơn hàng
        </Typography>

        <Stepper activeStep={1} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {cart.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" mb={3}>
              Giỏ hàng của bạn đang trống
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, '@media (min-width: 900px)': { gridTemplateColumns: '7fr 5fr' } }}>
            {/* LEFT COLUMN */}
            <Box>
              {/* CART ITEMS */}
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Sản phẩm ({cart.length})
                  </Typography>

                  {cart.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      <Box display="flex" gap={2}>
                        <Avatar
                          src={item.img}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />

                        <Box>
                          <Typography fontWeight="bold">
                            {item.name}
                          </Typography>

                          <Typography color="#d70018" fontWeight="bold">
                            {formatPrice(item.price)}
                          </Typography>

                          <Box display="flex" alignItems="center" mt={1}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                            >
                              <RemoveIcon />
                            </IconButton>

                            <Typography mx={1}>
                              {item.quantity}
                            </Typography>

                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                            >
                              <AddIcon />
                            </IconButton>

                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => removeItem(item.id!)}
                              sx={{ ml: 2 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      <Typography fontWeight="bold">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* SHIPPING INFO */}
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Thông tin giao hàng
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Họ tên"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Số điện thoại"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Địa chỉ"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={2}
                  />

                  <TextField
                    label="Ghi chú (tùy chọn)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Box>
              </Paper>

              {/* PAYMENT METHOD */}
              <Paper sx={{ p: 4, borderRadius: 3, mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Phương thức thanh toán
                </Typography>

                <RadioGroup
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography>Thanh toán khi nhận hàng (COD)</Typography>
                      </Box>
                    }
                  />
                  <Paper sx={{ p: 2, ml: 4, mb: 1, bgcolor: "#f9f9f9" }}>
                    <Typography variant="body2" color="text.secondary">
                      Trả tiền mặt khi nhận được hàng
                    </Typography>
                  </Paper>

                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <img src="/bank-icon.png" alt="" style={{ width: 20, height: 20 }} />
                        <Typography>Chuyển khoản ngân hàng</Typography>
                      </Box>
                    }
                  />
                  <Paper sx={{ p: 2, ml: 4, mb: 1, bgcolor: "#f9f9f9" }}>
                    <Typography variant="body2" color="text.secondary">
                      Chuyển khoản trước qua ATM/Internet Banking
                    </Typography>
                  </Paper>

                  <FormControlLabel
                    value="momo"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ bgcolor: "#a50064", color: "#fff", px: 0.5, borderRadius: 1, fontSize: 12, fontWeight: "bold" }}>
                          MoMo
                        </Typography>
                        <Typography>Ví MoMo</Typography>
                      </Box>
                    }
                  />
                  <Paper sx={{ p: 2, ml: 4, mb: 1, bgcolor: "#f9f9f9" }}>
                    <Typography variant="body2" color="text.secondary">
                      Thanh toán qua ứng dụng MoMo
                    </Typography>
                  </Paper>

                  <FormControlLabel
                    value="vnpay"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ bgcolor: "#1976d2", color: "#fff", px: 0.5, borderRadius: 1, fontSize: 12, fontWeight: "bold" }}>
                          VNPay
                        </Typography>
                        <Typography>VNPay</Typography>
                      </Box>
                    }
                  />
                  <Paper sx={{ p: 2, ml: 4, bgcolor: "#f9f9f9" }}>
                    <Typography variant="body2" color="text.secondary">
                      Thanh toán qua cổng VNPay (ATM/Visa/Mastercard)
                    </Typography>
                  </Paper>
                </RadioGroup>
              </Paper>
            </Box>

            {/* RIGHT COLUMN - ORDER SUMMARY */}
            <Box>
              <Paper sx={{ p: 4, borderRadius: 3, position: "sticky", top: 20 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Tổng quan đơn hàng
                </Typography>

                {/* Coupon */}
                <Box mb={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Mã giảm giá"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button 
                            onClick={applyCoupon}
                            size="small"
                            startIcon={<LocalOfferIcon />}
                          >
                            Áp dụng
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {couponDiscount > 0 && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`Giảm ${formatPrice(couponDiscount)}`}
                      color="success"
                      sx={{ mt: 1 }}
                      onDelete={() => {
                        setCouponDiscount(0);
                        setCouponCode("");
                      }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Summary */}
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Tạm tính</Typography>
                    <Typography>{formatPrice(subTotal)}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Phí vận chuyển</Typography>
                    <Typography color={shippingFee === 0 ? "success.main" : "text.primary"}>
                      {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </Typography>
                  </Box>

                  {couponDiscount > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Giảm giá</Typography>
                      <Typography color="success.main">
                        -{formatPrice(couponDiscount)}
                      </Typography>
                    </Box>
                  )}

                  {shippingFee === 0 && (
                    <Chip
                      label="Đơn hàng trên 500K - Miễn phí vận chuyển!"
                      color="success"
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    />
                  )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography fontWeight="bold" variant="h6">
                    Tổng tiền
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    fontSize={22}
                    color="#d70018"
                  >
                    {formatPrice(total)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg,#ff512f,#dd2476)",
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: "bold",
                    borderRadius: 3,
                    mb: 2
                  }}
                  onClick={handleOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Đặt hàng"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/cart")}
                >
                  Quay lại giỏ hàng
                </Button>

                <Typography variant="caption" color="text.secondary" display="block" mt={2} textAlign="center">
                  Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}
      </Container>

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
    </Box>
  );
};

export default Checkout;
