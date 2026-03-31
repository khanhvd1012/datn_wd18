import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stack,
  Avatar,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tooltip,
  Chip,
  Badge,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCartApi, clearCartApi } from "../services/cartService";
import { createOrderApi } from "../services/orderService";
import { createVNPayPaymentApi } from "../services/paymentService";
import type { CartItem } from "../services/cartService";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });

  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const premiumFont = { fontFamily: "'Inter', system-ui, sans-serif" };

  useEffect(() => {
    fetchCart();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.fullName || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCartApi();
      setCart(data || []);
    } catch (e) {
      setNotif({
        open: true,
        message: "Không thể tải giỏ hàng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setAppliedCoupon(null);
    try {
      const subtotal = cart.reduce((s, it) => s + (it.totalPrice || 0), 0);
      const res = await fetch(
        `http://localhost:3000/api/vouchers/check/${couponInput.trim().toUpperCase()}?order_amount=${subtotal}`
      );
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.message || "Mã không hợp lệ");
      } else {
        setAppliedCoupon(data.data);
      }
    } catch {
      setCouponError("Không thể kiểm tra mã giảm giá");
    } finally {
      setCouponLoading(false);
    }
  };

  const calcCouponDiscount = (subtotal: number) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === "percentage") {
      const d = subtotal * (appliedCoupon.discount_value / 100);
      return appliedCoupon.max_discount_amount > 0 ? Math.min(d, appliedCoupon.max_discount_amount) : d;
    }
    return Math.min(appliedCoupon.discount_value, subtotal);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setNotif({ open: true, message: "Giỏ hàng trống", severity: "warning" });
      return;
    }

    if (!formData.customerName || !formData.phone || !formData.address || !formData.email) {
      setNotif({ open: true, message: "Vui lòng nhập đầy đủ thông tin giao hàng", severity: "warning" });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shipping_info: {
          name: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        payment_method: formData.paymentMethod.toLowerCase(),
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        notes: ""
      };

      const order = await createOrderApi(orderData);
      await clearCartApi();
      
      // Dispatch event to update Header badge
      window.dispatchEvent(new Event("cartUpdated"));
      
      setNotif({
        open: true,
        message: "Đặt hàng thành công",
        severity: "success",
      });
      
      setTimeout(async () => {
        if (formData.paymentMethod === "COD") {
          navigate("/order-success", { state: { orderId: order._id } });
        } else if (formData.paymentMethod === "BANK") {
          navigate("/payment/bank", { state: { orderId: order._id } });
        } else if (formData.paymentMethod === "VNPAY") {
          try {
            const res = await createVNPayPaymentApi({ orderId: order._id });
            if (res.paymentUrl) {
              window.location.href = res.paymentUrl;
            } else if (res.useMock) {
              navigate("/payment/mock", { state: { orderId: order._id } });
            }
          } catch (err) {
            navigate("/orders");
          }
        } else {
          navigate("/order-success");
        }
      }, 1500);
    } catch (e: any) {
      setNotif({
        open: true,
        message: e.response?.data?.message || "Đặt hàng thất bại",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, it) => sum + (it.totalPrice || 0), 0);

  if (loading && cart.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} sx={{ color: '#d70018' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link color="inherit" href="/" sx={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>Trang chủ</Link>
        <Link color="inherit" href="/cart" sx={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>Giỏ hàng</Link>
        <Typography color="text.primary" fontWeight="600">Thanh toán</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" sx={{ ...premiumFont, letterSpacing: '-1px', color: '#1a1a1a' }}>
            Thông tin thanh toán
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ...premiumFont, mt: 0.5, fontWeight: 400 }}>
            Kiểm tra và hoàn tất đặt hàng của bạn
        </Typography>
      </Box>

      <Grid container spacing={5}>
        {/* Main Content: Split into 8/4 for perfect balance */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            {/* Shipping Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #f0f0f0", bgcolor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Box sx={{ bgcolor: 'rgba(215, 0, 24, 0.1)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                    <LocalShippingIcon sx={{ color: '#d70018' }} />
                </Box>
                <Typography variant="h5" fontWeight="900" sx={{ ...premiumFont }}>Thông tin nhận hàng</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Họ và tên người nhận"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Địa chỉ Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Địa chỉ giao hàng chi tiết"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #f0f0f0", bgcolor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Box sx={{ bgcolor: 'rgba(56, 142, 60, 0.1)', p: 1.2, borderRadius: 2, display: 'flex' }}>
                    <PaymentIcon sx={{ color: '#388e3c', fontSize: '1.2rem' }} />
                </Box>
                <Typography variant="h6" fontWeight="900" sx={{ ...premiumFont, fontSize: '1.1rem' }}>Phương thức thanh toán</Typography>
              </Box>
              
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <Stack spacing={2}>
                    {[
                      { 
                        id: 'COD', 
                        title: 'Thanh toán trực tiếp (COD)', 
                        desc: 'Thanh toán bằng tiền mặt khi nhận hàng', 
                        icon: <MonetizationOnIcon sx={{ color: '#ff9800' }} /> 
                      },
                      { 
                        id: 'BANK', 
                        title: 'Chuyển khoản ngân hàng', 
                        desc: 'Thực hiện chuyển khoản qua app ngân hàng', 
                        icon: <AccountBalanceIcon sx={{ color: '#1976d2' }} /> 
                      },
                      { 
                        id: 'VNPAY', 
                        title: 'VNPay / Thẻ quốc tế', 
                        desc: 'Thanh toán QR-code qua ứng dụng VNPay hoặc thẻ Visa/Master', 
                        icon: <CreditCardIcon sx={{ color: '#d70018' }} /> 
                      }
                    ].map((method) => (
                      <Box 
                        key={method.id}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                        sx={{ 
                          border: "2px solid", 
                          borderColor: formData.paymentMethod === method.id ? '#d70018' : '#f0f0f0',
                          bgcolor: formData.paymentMethod === method.id ? 'rgba(215, 0, 24, 0.02)' : 'transparent',
                          borderRadius: 4, 
                          px: 2.5, 
                          py: 1.5,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: '#d70018', bgcolor: 'rgba(215, 0, 24, 0.02)' }
                        }}
                      >
                        <Grid container spacing={2.5} alignItems="center">
                          <Grid size="auto">
                            <Radio 
                                value={method.id} 
                                checked={formData.paymentMethod === method.id}
                                sx={{ color: '#d70018', '&.Mui-checked': { color: '#d70018' }, p: 0.5 }} 
                            />
                          </Grid>
                          <Grid size="auto">
                            <Box sx={{ 
                                minWidth: 46, 
                                height: 46, 
                                bgcolor: '#f5f5f5', 
                                borderRadius: 2.5, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                {method.icon}
                            </Box>
                          </Grid>
                          <Grid size="grow">
                            <Box>
                                <Typography fontWeight="700" sx={{ ...premiumFont, color: '#1a1a1a', fontSize: '0.95rem', lineHeight: 1.2 }}>{method.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ...premiumFont, fontSize: '0.78rem', mt: 0.3, opacity: 0.8 }}>{method.desc}</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Paper>
            
            <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/cart")}
                sx={{ width: 'fit-content', fontWeight: 'bold' }}
            >
                Quay lại giỏ hàng
            </Button>
          </Stack>
        </Grid>

        {/* Right column: Sticky Summary 4 columns */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
                borderRadius: 6, 
                border: "1px solid #f0f0f0", 
                position: 'sticky', 
                top: 100,
                boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2.5, bgcolor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <AssignmentIcon sx={{ color: '#1a1a1a', fontSize: '1.2rem' }} />
                    <Typography variant="h6" fontWeight="900" sx={{ ...premiumFont, fontSize: '1rem' }}>Tóm tắt đơn hàng</Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5} sx={{ maxHeight: '420px', overflowY: 'auto', pr: 1.5, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#eee', borderRadius: '4px' } }}>
                {cart.map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', gap: 2, position: 'relative', px: 1 }}>
                        <Badge 
                            badgeContent={item.quantity} 
                            color="error"
                            overlap="rectangular"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            sx={{ 
                                '& .MuiBadge-badge': { 
                                    fontWeight: '800', 
                                    fontSize: '0.65rem', 
                                    height: 18, 
                                    minWidth: 18, 
                                    borderRadius: '50%',
                                    top: 4,
                                    right: 4,
                                    border: '1.5px solid #fff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                } 
                            }}
                        >
                            <Avatar 
                                src={item.variant?.images?.[0] ?? item.product.images[0] ?? ""}
                                variant="rounded"
                                sx={{ width: 56, height: 56, borderRadius: 1.5, border: '1px solid #f0f0f0', bgcolor: '#fff' }}
                            />
                        </Badge>
                        <Box flexGrow={1} sx={{ pt: 0.5 }}>
                            <Typography fontWeight="700" sx={{ ...premiumFont, lineHeight: 1.2, mb: 0.5, fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#1a1a1a' }}>
                                {item.product.name}
                            </Typography>
                            {item.variant?.name && (
                                <Typography variant="caption" sx={{ ...premiumFont, bgcolor: '#f5f5f5', px: 1, py: 0.4, borderRadius: 1, fontWeight: '700', fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>
                                    {item.variant.name}
                                </Typography>
                            )}
                            <Typography fontWeight="800" color="error.main" sx={{ ...premiumFont, mt: 0.8, fontSize: '0.95rem' }}>
                                {formatPrice(item.totalPrice || 0)}
                            </Typography>
                        </Box>
                    </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

              {/* ── Coupon Input ── */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="700" sx={{ ...premiumFont, mb: 1.5, color: '#1a1a1a' }}>
                  🎫 Mã giảm giá
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Nhập mã khuyến mãi"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); setAppliedCoupon(null); }}
                    onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                    error={!!couponError}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' },
                    }}
                    InputProps={{
                      endAdornment: appliedCoupon ? (
                        <Tooltip title="Xóa mã">
                          <IconButton size="small" onClick={() => { setAppliedCoupon(null); setCouponInput(""); }}>
                            ✕
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap', borderColor: '#d70018', color: '#d70018', '&:hover': { bgcolor: 'rgba(215,0,24,0.04)', borderColor: '#b30014' } }}
                  >
                    {couponLoading ? <CircularProgress size={16} /> : "Áp dụng"}
                  </Button>
                </Box>
                {couponError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>❌ {couponError}</Typography>
                )}
                {appliedCoupon && (
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                    <Typography variant="caption" fontWeight="700" color="#166534">
                      ✅ "{appliedCoupon.code}" — {appliedCoupon.name}
                      {appliedCoupon.discount_type === 'percentage'
                        ? ` (-${appliedCoupon.discount_value}%)`
                        : ` (-${appliedCoupon.discount_value.toLocaleString('vi-VN')}₫)`}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary" fontWeight="600" sx={{ ...premiumFont }}>Tạm tính</Typography>
                  <Typography fontWeight="800" variant="h6" sx={{ ...premiumFont }}>{total.toLocaleString("vi-VN")}₫</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary" fontWeight="600" sx={{ ...premiumFont }}>Phí giao hàng</Typography>
                  <Chip label="Miễn phí" size="small" sx={{ bgcolor: '#f0fdf4', color: '#166534', fontWeight: 'bold', borderRadius: 1.5 }} />
                </Box>
                {appliedCoupon && calcCouponDiscount(total) > 0 && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary" fontWeight="600" sx={{ ...premiumFont }}>Giảm giá mã</Typography>
                    <Typography fontWeight="800" color="success.main" sx={{ ...premiumFont }}>
                      -{calcCouponDiscount(total).toLocaleString("vi-VN")}₫
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#1a1a1a', color: '#fff' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" fontWeight="600" sx={{ opacity: 0.8, ...premiumFont }}>Tổng thanh toán</Typography>
                        <Typography variant="h6" fontWeight="900" sx={{ ...premiumFont }}>
                            {Math.max(0, total - calcCouponDiscount(total)).toLocaleString("vi-VN")}₫
                        </Typography>
                    </Box>
                </Box>
              </Stack>


              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                sx={{ 
                  mt: 3, 
                  py: 2.5, 
                  borderRadius: 4, 
                  fontWeight: "900",
                  fontSize: '1.2rem',
                  textTransform: 'none',
                  ...premiumFont,
                  background: 'linear-gradient(90deg, #d70018 0%, #ff4b2b 100%)',
                  boxShadow: '0 10px 25px rgba(215, 0, 24, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 30px rgba(215, 0, 24, 0.4)',
                    background: 'linear-gradient(90deg, #b30014 0%, #e63e1f 100%)',
                  },
                  '&:disabled': {
                    background: '#ccc'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Hoàn tất đặt hàng"}
              </Button>
              
              <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3, color: 'text.secondary', px: 2 }}>
                Bằng cách nhấn "Hoàn tất đặt hàng", bạn đồng ý với các Điều khoản và Chính sách của chúng tôi.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={notif.open}
        autoHideDuration={4000}
        onClose={() => setNotif((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notif.severity}
          onClose={() => setNotif((s) => ({ ...s, open: false }))}
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 'bold' }}
        >
          {notif.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
