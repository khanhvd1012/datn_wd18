import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderByIdApi } from "../services/orderService";
import type { Order } from "../services/orderService";
import { createReviewApi } from "../services/reviewService";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Divider,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha
} from "@mui/material";
import { ArrowBack, CheckCircle, LocalShippingOutlined, ReceiptLongOutlined } from "@mui/icons-material";

// Helper function to get image URL properly
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://placehold.co/100x100?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("uploads/")) {
    return `http://localhost:3000/${imagePath}`;
  }
  return `http://localhost:3000/uploads/products/${imagePath}`;
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [order, setOrder] = useState<Order | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    if (!id) return;
    getOrderByIdApi(id)
      .then(res => setOrder(res))
      .catch(() => navigate("/404"));
  }, [id, navigate]);

  const handleOpenReviewDialog = (item: any) => {
    setSelectedProduct(item);
    setReviewDialogOpen(true);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleSubmitReview = async () => {
    if (!id || !selectedProduct) return;
    setSubmitting(true);
    try {
      await createReviewApi({
        productId: selectedProduct.product_id?._id || selectedProduct.product_id || selectedProduct.product,
        rating: reviewRating,
        comment: reviewComment,
        orderId: id
      });
      setNotification({ open: true, message: "Đánh giá thành công!", severity: "success" });
      setReviewDialogOpen(false);
    } catch (error) {
      setNotification({ open: true, message: "Lỗi khi gửi đánh giá", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} thickness={4} sx={{ color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h6" color="text.secondary" fontWeight={500}>Đang tải thông tin đơn hàng...</Typography>
      </Box>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending": return { label: "Chờ xác nhận", color: "warning" };
      case "confirmed": return { label: "Đã xác nhận", color: "success" };
      case "processing": return { label: "Đang xử lý", color: "info" };
      case "shipping": return { label: "Đang giao", color: "secondary" };
      case "delivered": return { label: "Đã giao hàng", color: "success" };
      case "cancelled": return { label: "Đã hủy", color: "error" };
      default: return { label: status || "Không xác định", color: "default" };
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "processing": return 1;
      case "shipping": return 2;
      case "delivered": return 3;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const statusInfo = getStatusInfo(order.order_status);
  const activeStep = getStepIndex(order.order_status);
  const steps = ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng'];

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", pb: 10, textAlign: 'left' }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#ffffff',
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 3,
        mb: 4,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/orders')}
              sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}
            >
              Trở về
            </Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
              Mã đơn: #{order._id.substring(order._id.length - 8).toUpperCase()}
            </Typography>
            <Chip 
              label={statusInfo.label} 
              color={statusInfo.color as any} 
              sx={{ ml: 'auto', fontWeight: 600, borderRadius: 1.5, px: 1 }} 
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: { xs: 0, md: -2 } }}>
          <Box sx={{ width: { xs: '100%', md: '66.666%' }, px: { xs: 0, md: 2 }, mb: { xs: 4, md: 0 } }}>
            {/* Tình trạng đơn hàng */}
            {order.order_status !== 'cancelled' ? (
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={4} display="flex" alignItems="center" gap={1}>
                  <LocalShippingOutlined color="primary" /> Tình trạng vận chuyển
                </Typography>
                
                <Stepper activeStep={activeStep} alternativeLabel sx={{
                  '& .MuiStepConnector-line': { borderColor: theme.palette.divider, borderWidth: 2 },
                  '& .MuiStepIcon-root': { width: 32, height: 32, color: theme.palette.divider },
                  '& .MuiStepIcon-root.Mui-active': { color: theme.palette.primary.main },
                  '& .MuiStepIcon-root.Mui-completed': { color: theme.palette.success.main },
                }}>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel StepIconProps={{
                        icon: index <= activeStep ? <CheckCircle /> : undefined
                      }}>
                        <Typography variant="subtitle2" fontWeight={index === activeStep ? 700 : 500} color={index <= activeStep ? "text.primary" : "text.secondary"}>
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            ) : (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 2, alignItems: 'center' }}>
                <Typography fontWeight={600}>Đơn hàng đã bị hủy</Typography>
              </Alert>
            )}

            {/* Sản phẩm */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                <ReceiptLongOutlined color="primary" /> Danh sách sản phẩm
              </Typography>
              
              <Stack spacing={3} divider={<Divider />}>
                {order.order_items?.map((item: any) => {
                  const productInfo = item.product_id || {};
                  const itemName = item.name || productInfo.name || "Sản phẩm";
                  const itemImage = getImageUrl(item.image || (productInfo.images ? productInfo.images[0] : ""));
                  
                  return (
                    <Box key={item._id || item.product_id} sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                      <Box sx={{ 
                        width: 100, 
                        height: 100, 
                        borderRadius: 2, 
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: 'white',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <img 
                          src={itemImage} 
                          alt={itemName} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        />
                      </Box>
                      
                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={600}>{itemName}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 2 }}>
                          <Stack direction="row" spacing={3}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">Đơn giá</Typography>
                              <Typography variant="body2" fontWeight={600}>{item.price?.toLocaleString()}₫</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">Số lượng</Typography>
                              <Typography variant="body2" fontWeight={600}>x{item.quantity}</Typography>
                            </Box>
                          </Stack>
                          
                          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                            {(item.price * item.quantity).toLocaleString()}₫
                          </Typography>
                        </Box>

                        {order.order_status === 'delivered' && (
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenReviewDialog(item)}
                              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                            >
                              Viết đánh giá
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '33.333%' }, pl: { md: 2 } }}>
            {/* Người nhận */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Thông tin nhận hàng</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Người nhận</Typography>
                  <Typography variant="body1" fontWeight={600}>{order.shipping_info.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Số điện thoại</Typography>
                  <Typography variant="body1" fontWeight={500}>{order.shipping_info.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email liên hệ</Typography>
                  <Typography variant="body1" fontWeight={500}>{order.shipping_info.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Địa chỉ giao hàng</Typography>
                  <Typography variant="body1" fontWeight={500}>{order.shipping_info.address}</Typography>
                </Box>
                {order.notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ghi chú</Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), p: 1.5, borderRadius: 1.5, color: 'warning.dark' }}>
                      {order.notes}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Thanh toán */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Chi tiết thanh toán</Typography>
              
              <Stack spacing={2} mb={3}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Tổng tiền hàng</Typography>
                  <Typography fontWeight={600}>{(order.subtotal || 0).toLocaleString()}₫</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Phí vận chuyển</Typography>
                  <Typography fontWeight={600}>{(order.shipping_fee || 0).toLocaleString()}₫</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Khuyến mãi</Typography>
                  <Typography fontWeight={600} color="success.main">-{(order.discount || 0).toLocaleString()}₫</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="body1" fontWeight={700}>Thành tiền</Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  {order.total?.toLocaleString()}₫
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  Phương thức thanh toán
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" fontWeight={700} color="info.dark">
                    {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.payment_method === 'vnpay' ? 'Thanh toán qua VNPAY' : 'Chuyển khoản / Khác'}
                  </Typography>
                  <Chip 
                    label={order.payment_status === 'paid' ? 'Đã thu tiền' : 'Chưa thu tiền'} 
                    size="small"
                    color={order.payment_status === 'paid' ? 'success' : 'warning'}
                    variant="filled"
                    sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24 }}
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Đánh giá sản phẩm</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            {selectedProduct && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.divider, 0.4) }}>
                <Avatar 
                  src={getImageUrl(selectedProduct.image || (selectedProduct.product_id?.images ? selectedProduct.product_id.images[0] : ""))} 
                  variant="rounded" 
                  sx={{ width: 48, height: 48 }}
                />
                <Typography variant="subtitle2" fontWeight={600}>
                  {selectedProduct.name || (selectedProduct.product_id?.name) || "Sản phẩm"}
                </Typography>
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={2}>
              <Typography fontWeight={600}>Chất lượng sản phẩm:</Typography>
              <Rating 
                value={reviewRating} 
                onChange={(_, newValue) => setReviewRating(newValue || 5)} 
                size="large"
              />
            </Box>

            <TextField
              label="Bình luận của bạn"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm để giúp những người mua khác nhé!"
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setReviewDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Hủy bỏ
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitReview} 
            disabled={submitting || !reviewComment.trim()}
            disableElevation
            sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 600 }}
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={notification.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderDetail;
