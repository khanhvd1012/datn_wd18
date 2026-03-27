import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Container,
  Breadcrumbs,
  Link,
  Chip,
  Skeleton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi load order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return (price || 0).toLocaleString("vi-VN") + "₫";
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", color: "warning" as const, step: 0 };
      case "confirmed":
        return { label: "Đã xác nhận", color: "info" as const, step: 1 };
      case "processing":
        return { label: "Đang xử lý", color: "info" as const, step: 2 };
      case "shipping":
        return { label: "Đang giao hàng", color: "primary" as const, step: 3 };
      case "delivered":
        return { label: "Đã giao hàng", color: "success" as const, step: 4 };
      case "cancelled":
        return { label: "Đã hủy", color: "error" as const, step: -1 };
      default:
        return { label: "Chờ xác nhận", color: "warning" as const, step: 0 };
    }
  };

  const getPaymentStatus = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ thanh toán", color: "warning" as const };
      case "paid":
        return { label: "Đã thanh toán", color: "success" as const };
      case "failed":
        return { label: "Thanh toán thất bại", color: "error" as const };
      case "refunded":
        return { label: "Đã hoàn tiền", color: "info" as const };
      default:
        return { label: "Chờ thanh toán", color: "warning" as const };
    }
  };

  const getPaymentMethod = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "momo":
        return "Ví MoMo";
      case "vnpay":
        return "VNPay";
      default:
        return method;
    }
  };

  const steps = ["Chờ xác nhận", "Đã xác nhận", "Đang xử lý", "Đang giao hàng", "Đã giao hàng"];

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" mb={2}>
            Không tìm thấy đơn hàng
          </Typography>
          <Button variant="contained" onClick={() => navigate("/orders")}>
            Quay lại danh sách đơn hàng
          </Button>
        </Paper>
      </Container>
    );
  }

  const status = getStatus(order.order_status || order.status);
  const paymentStatus = getPaymentStatus(order.payment_status || order.paymentStatus);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </Link>
        <Link
          underline="hover"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/orders")}
        >
          Đơn hàng
        </Link>
        <Typography>
          #{order._id?.toString().slice(-6).toUpperCase() || order.id}
        </Typography>
      </Breadcrumbs>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/orders")}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      {/* Order Header */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Đơn hàng #{order._id?.toString().slice(-6).toUpperCase() || order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={status.label}
              color={status.color}
              sx={{ fontWeight: "bold" }}
            />
            <Chip
              label={paymentStatus.label}
              color={paymentStatus.color}
              variant="outlined"
            />
          </Stack>
        </Box>

        {/* Order Progress */}
        {status.step >= 0 && (
          <Stepper activeStep={status.step} sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Paper>

      {/* Shipping Info */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Thông tin giao hàng
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LocationOnIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">Địa chỉ giao hàng</Typography>
              <Typography>{order.shipping_info?.address}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LocalShippingIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">Người nhận</Typography>
              <Typography>{order.shipping_info?.name}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PhoneIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
              <Typography>{order.shipping_info?.phone}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <EmailIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography>{order.shipping_info?.email}</Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Order Items */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Sản phẩm đã đặt
        </Typography>

        <Stack spacing={2}>
          {(order.order_items || order.items || []).map((item: any, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 2,
                border: "1px solid #eee",
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={item.image || item.img}
                onError={(e: any) => {
                  e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                }}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  borderRadius: 1,
                  bgcolor: "#f5f5f5",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(item.price)} x {item.quantity}
                </Typography>
              </Box>
              <Typography fontWeight="bold" color="#d70018">
                {formatPrice((item.price || 0) * (item.quantity || 0))}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Payment Info */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Thanh toán
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Phương thức thanh toán</Typography>
            <Typography>{getPaymentMethod(order.payment_method)}</Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Tạm tính</Typography>
            <Typography>{formatPrice(order.subtotal)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Phí vận chuyển</Typography>
            <Typography>
              {order.shipping_fee === 0 ? "Miễn phí" : formatPrice(order.shipping_fee)}
            </Typography>
          </Box>

          {(order.discount || order.coupon_discount) > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Giảm giá</Typography>
              <Typography color="success.main">
                -{formatPrice(order.discount || order.coupon_discount)}
              </Typography>
            </Box>
          )}

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
            <Typography variant="h6" fontWeight="bold" color="#d70018">
              {formatPrice(order.total)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Notes */}
      {order.notes && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Ghi chú
          </Typography>
          <Typography>{order.notes}</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default OrderDetail;
