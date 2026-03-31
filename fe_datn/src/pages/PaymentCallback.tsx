import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrderByIdApi } from "../services/orderService";
import { createVNPayPaymentApi, processMockPaymentApi } from "../services/paymentService";

const PaymentCallback = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    if (!orderId) {
      setError("Không tìm thấy thông tin đơn hàng");
      setLoading(false);
      return;
    }

    fetchOrderDetails(orderId);
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const orderData = await getOrderByIdApi(orderId);
      setOrder(orderData);
      
      if (orderData.payment_status === "paid") {
        setError("Đơn hàng đã được thanh toán thành công!");
      } else if (orderData.payment_status === "failed") {
        setError("Thanh toán thất bại. Vui lòng thử lại.");
      } else {
        setError("Thanh toán đang chờ xử lý.");
      }
    } catch (err) {
      setError("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!order) return;

    try {
      if (order.payment_method === "vnpay") {
        const res = await createVNPayPaymentApi({ orderId: order._id });
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        }
      } else if (order.payment_method === "cod") {
        const res = await processMockPaymentApi({ orderId: order._id });
        if (res.order) {
          navigate("/order-success");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xử lý thanh toán");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#f8fafc,#ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 6,
          borderRadius: 3,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          {error.includes("thành công") ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại"}
        </Typography>

        {error && (
          <Alert severity={error.includes("thành công") ? "success" : "error"} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {order && (
          <Box sx={{ textAlign: "left", width: "100%" }}>
            <Typography variant="h6" mb={2}>
              Thông tin đơn hàng:
            </Typography>
            <Stack spacing={1}>
              <Typography>
                <strong>Mã đơn hàng:</strong> {order._id}
              </Typography>
              <Typography>
                <strong>Tổng tiền:</strong> {order.total?.toLocaleString("vi-VN")}₫
              </Typography>
              <Typography>
                <strong>Phương thức thanh toán:</strong> {order.payment_method?.toUpperCase()}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong> {order.payment_status}
              </Typography>
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
            sx={{ mr: 2 }}
          >
            Xem đơn hàng
          </Button>
          
          {error.includes("thất bại") && order && (
            <Button
              variant="contained"
              onClick={handleRetryPayment}
              sx={{
                background: "linear-gradient(90deg,#ff512f,#dd2476)",
                "&:hover": {
                  background: "linear-gradient(90deg,#e94426,#c21d64)",
                },
              }}
            >
              Thử lại thanh toán
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default PaymentCallback;
