import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
  Container,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${orderId}`);
          setOrder(res.data);
        } catch (err) {
          console.error("Lỗi load order:", err);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const formatPrice = (price: number) => {
    return (price || 0).toLocaleString("vi-VN") + "₫";
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "#e8f5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 60, color: "#4caf50" }} />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Đặt hàng thành công!
        </Typography>

        <Typography color="text.secondary" mb={4}>
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận.
        </Typography>

        {order && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              textAlign: "left",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Mã đơn hàng:</Typography>
                <Typography fontWeight="bold">
                  #{(order._id || order.id)?.toString().slice(-6).toUpperCase()}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Người nhận:</Typography>
                <Typography fontWeight="bold">
                  {order.shipping_info?.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Số điện thoại:</Typography>
                <Typography>{order.shipping_info?.phone}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Địa chỉ:</Typography>
                <Typography>{order.shipping_info?.address}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Phương thức thanh toán:</Typography>
                <Typography>
                  {order.payment_method === "cod" && "Thanh toán khi nhận hàng (COD)"}
                  {order.payment_method === "bank" && "Chuyển khoản ngân hàng"}
                  {order.payment_method === "momo" && "Ví MoMo"}
                  {order.payment_method === "vnpay" && "VNPay"}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="bold">Tổng tiền:</Typography>
                <Typography variant="h6" fontWeight="bold" color="#d70018">
                  {formatPrice(order.total)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/orders")}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            startIcon={<LocalShippingIcon />}
            onClick={() => navigate("/")}
            sx={{
              background: "#d70018",
              "&:hover": { background: "#b71c1c" },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Stack>
      </Paper>

      {/* Delivery Info */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Thông tin giao hàng
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="bold">1</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Xác nhận đơn hàng</Typography>
              <Typography variant="body2" color="text.secondary">
                Chúng tôi sẽ xác nhận đơn hàng trong vòng 24 giờ
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="bold">2</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Đóng gói & Giao cho đơn vị vận chuyển</Typography>
              <Typography variant="body2" color="text.secondary">
                Đơn hàng sẽ được đóng gói cẩn thận và giao cho đơn vị vận chuyển
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="bold">3</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Giao hàng thành công</Typography>
              <Typography variant="body2" color="text.secondary">
                Nhận hàng và thanh toán (nếu chưa thanh toán online)
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;
