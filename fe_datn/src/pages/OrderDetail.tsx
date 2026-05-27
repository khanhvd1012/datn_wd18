import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderByIdApi, cancelOrderApi, confirmOrderReceivedApi, isOnlinePaymentMethod } from "../services/orderService";
import type { Order } from "../services/orderService";
import { createReviewApi } from "../services/reviewService";
import { createReturnRequest } from "../services/returnService";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const getDeliveryProofUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  // Backend lưu dạng: uploads/<filename>
  return `http://localhost:3000/${imagePath.startsWith("uploads/") ? imagePath : `uploads/${imagePath}`}`;
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
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [customReturnReason, setCustomReturnReason] = useState("");
  const [returnImages, setReturnImages] = useState<File[]>([]);
  const [returnLoading, setReturnLoading] = useState(false);
  const [confirmingReceived, setConfirmingReceived] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [deliveryFeedback, setDeliveryFeedback] = useState("");
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
      case "received": return { label: "Đã nhận hàng thành công", color: "success" };
      case "cancelled": return { label: "Đã hủy", color: "error" };
      default: return { label: status || "Không xác định", color: "default" };
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "processing": return 2;
      case "shipping": return 3;
      case "delivered": return 4;
      case "received": return 5;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const canCustomerCancel = ["pending", "confirmed", "processing"].includes(order.order_status);
  const canRequestReturn =
    order.order_status === "received" &&
    !(order as any).return_requested &&
    ((order as any).return_status === undefined || (order as any).return_status === "none");

  const handleOpenCancelDialog = () => {
    if (!id) return;
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!id) return;
    if (!cancelReason.trim()) {
      setNotification({ open: true, message: "Vui lòng nhập lý do hủy đơn", severity: "error" });
      return;
    }
    setCancelling(true);
    try {
      const updated = await cancelOrderApi(id, cancelReason);
      setOrder(updated);
      setNotification({ open: true, message: "Đã hủy đơn hàng thành công", severity: "success" });
      setCancelDialogOpen(false);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Không thể hủy đơn hàng",
        severity: "error",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!id) return;
    setConfirmingReceived(true);
    try {
      const updated = await confirmOrderReceivedApi(id, {
        delivery_rating: deliveryRating,
        delivery_feedback: deliveryFeedback,
      });
      setOrder(updated);
      setConfirmDialogOpen(false);
      setNotification({ open: true, message: "Đã xác nhận nhận hàng thành công", severity: "success" });
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Không thể xác nhận nhận hàng",
        severity: "error",
      });
    } finally {
      setConfirmingReceived(false);
    }
  };

  const handleOpenReturnDialog = () => {
    setReturnReason("");
    setCustomReturnReason("");
    setReturnImages([]);
    setReturnDialogOpen(true);
  };

  const handleSubmitReturn = async () => {
    const finalReturnReason =
      returnReason === "other"
        ? customReturnReason.trim()
        : returnReason.trim();

    if (!id || !finalReturnReason) {
      setNotification({
        open: true,
        message: "Vui lòng chọn lý do hoàn hàng",
        severity: "error",
      });
      return;
    }
    if (!returnImages.length) {
      setNotification({
        open: true,
        message: "Vui lòng tải lên ít nhất 1 ảnh minh chứng",
        severity: "error",
      });
      return;
    }

    try {
      setReturnLoading(true);
      const items = (order.order_items || []).map((item: any) => ({
        product_id: typeof item.product_id === "object" ? item.product_id?._id : item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
      }));

      const formData = new FormData();
      formData.append("order_id", id);
      formData.append("reason", finalReturnReason);
      formData.append("items", JSON.stringify(items));
      returnImages.forEach((file) => {
        formData.append("return_images", file);
      });

      await createReturnRequest(formData);

      setReturnDialogOpen(false);
      setNotification({
        open: true,
        message: "Gửi yêu cầu hoàn hàng thành công",
        severity: "success",
      });

      const latest = await getOrderByIdApi(id);
      setOrder(latest);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Không thể gửi yêu cầu hoàn hàng",
        severity: "error",
      });
    } finally {
      setReturnLoading(false);
    }
  };

  const statusInfo = getStatusInfo(order.order_status);
  const activeStep = getStepIndex(order.order_status);
  const steps = ['Chờ xác nhận', 'Đã xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã nhận hàng thành công', 'Đã xác nhận'];

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
            {canCustomerCancel && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={cancelling}
                onClick={handleOpenCancelDialog}
                sx={{ ml: 1, textTransform: 'none', fontWeight: 600 }}
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
              </Button>
            )}
            {order.order_status === "delivered" && (
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={confirmingReceived}
                onClick={() => setConfirmDialogOpen(true)}
                sx={{ ml: 1, textTransform: 'none', fontWeight: 600 }}
              >
                {confirmingReceived ? "Đang xác nhận..." : "Đã nhận được hàng"}
              </Button>
            )}
            {canRequestReturn && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleOpenReturnDialog}
                sx={{ ml: 1, textTransform: "none", fontWeight: 600 }}
              >
                Hoàn hàng
              </Button>
            )}
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
                {order.order_status === "delivered" && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
                    Hạn xác nhận đơn:{" "}
                    <b>
                      {order.confirmation_deadline_at
                        ? new Date(order.confirmation_deadline_at).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </b>
                    . Nếu quá hạn, hệ thống sẽ tự xác nhận đơn không có vấn đề.
                  </Typography>
                )}
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

                        {order.order_status === 'received' && (
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

            {/* Ảnh minh chứng giao hàng */}
            {(order.order_status === "delivered" || order.order_status === "received") && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mt: 4,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                  <CheckCircle /> Ảnh minh chứng giao hàng
                </Typography>

                {order.delivery_proof_images && order.delivery_proof_images.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {order.delivery_proof_images.map((img, idx) => (
                      <Box
                        key={`${img}-${idx}`}
                        sx={{
                          width: 160,
                          height: 110,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          overflow: "hidden",
                          bgcolor: "#fff",
                        }}
                      >
                        <img
                          src={getDeliveryProofUrl(img)}
                          alt={`Delivery proof ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" fontWeight={600}>
                    Chưa có ảnh minh chứng
                  </Typography>
                )}
              </Paper>
            )}
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
                    label={
                      isOnlinePaymentMethod(order.payment_method)
                        ? (order.payment_status === 'paid' ? 'Đã hoàn thành' : 'Chờ thanh toán')
                        : (order.payment_status === 'paid' ? 'Đã thu tiền' : 'Chưa thu tiền')
                    } 
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

      {/* Cancel Reason Dialog */}
      <Dialog 
        open={cancelDialogOpen} 
        onClose={() => setCancelDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: "error.main" }}>Lý do hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này.
            </Typography>
            <TextField
              label="Lý do hủy"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="VD: Thay đổi ý định, Đặt nhầm sản phẩm..."
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Không hủy nữa
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleCancelOrder} 
            disabled={cancelling || !cancelReason.trim()}
            disableElevation
            sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 600 }}
          >
            {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: "error.main" }}>
          Yêu cầu hoàn hàng
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" color="text.secondary">
              Vui lòng chọn lý do hoàn hàng để gửi yêu cầu đến cửa hàng.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="return-reason-label">Lý do hoàn hàng</InputLabel>
              <Select
                labelId="return-reason-label"
              value={returnReason}
                label="Lý do hoàn hàng"
                onChange={(e) => setReturnReason(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="Sản phẩm bị lỗi/hư hỏng">Sản phẩm bị lỗi/hư hỏng</MenuItem>
                <MenuItem value="Sản phẩm không đúng mô tả">Sản phẩm không đúng mô tả</MenuItem>
                <MenuItem value="Giao sai sản phẩm/màu/size">Giao sai sản phẩm/màu/size</MenuItem>
                <MenuItem value="Thiếu phụ kiện hoặc quà tặng">Thiếu phụ kiện hoặc quà tặng</MenuItem>
                <MenuItem value="other">Lý do khác</MenuItem>
              </Select>
            </FormControl>
            {returnReason === "other" && (
              <TextField
                label="Nhập lý do khác"
                multiline
                rows={3}
                fullWidth
                value={customReturnReason}
                onChange={(e) => setCustomReturnReason(e.target.value)}
                placeholder="Nhập chi tiết lý do hoàn hàng..."
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            )}
            <TextField
              type="file"
              fullWidth
              inputProps={{ multiple: true, accept: "image/*" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReturnImages(Array.from(e.target.files || []))
              }
            />
            <Typography variant="caption" color="text.secondary">
              Bắt buộc tải lên ít nhất 1 ảnh minh chứng (tối đa 5 ảnh).
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setReturnDialogOpen(false)} sx={{ textTransform: "none", fontWeight: 600 }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmitReturn}
            disabled={
              returnLoading ||
              !(returnReason && (returnReason !== "other" || customReturnReason.trim())) ||
              returnImages.length === 0
            }
            sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 600 }}
          >
            {returnLoading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: "success.main" }}>
          Xác nhận đã nhận hàng
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" color="text.secondary">
              Vui lòng đánh giá trải nghiệm giao hàng để hoàn tất xác nhận.
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography fontWeight={600}>Đánh giá giao hàng:</Typography>
              <Rating
                value={deliveryRating}
                onChange={(_, value) => setDeliveryRating(value || 5)}
              />
            </Box>
            <TextField
              label="Nhận xét (tuỳ chọn)"
              multiline
              rows={3}
              fullWidth
              value={deliveryFeedback}
              onChange={(e) => setDeliveryFeedback(e.target.value)}
              placeholder="Ví dụ: ship nhanh, đóng gói cẩn thận..."
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Đóng
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmReceived}
            disabled={confirmingReceived}
            sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 600 }}
          >
            {confirmingReceived ? "Đang xác nhận..." : "Xác nhận"}
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
