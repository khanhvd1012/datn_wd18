import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const paymentMethod = location.state?.paymentMethod || "vnpay";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/orders");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && response.data.order) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handlePayment = async () => {
    if (!orderId) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      if (paymentMethod === "vnpay") {
        // Tạo payment URL cho VNPay
        try {
          const response = await axios.post(
            "http://localhost:3000/api/payment/vnpay/create",
            { orderId },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.data && response.data.paymentUrl) {
            // Redirect đến VNPay
            window.location.href = response.data.paymentUrl;
          } else if (response.data && response.data.useMock) {
            // Nếu VNPay chưa được cấu hình, chuyển sang mock payment
            navigate("/payment/mock", { state: { orderId } });
            setProcessing(false);
          } else {
            alert("Không thể tạo link thanh toán");
            setProcessing(false);
          }
        } catch (error: any) {
          // Nếu lỗi do VNPay chưa cấu hình, chuyển sang mock payment
          if (error.response?.data?.useMock) {
            navigate("/payment/mock", { state: { orderId } });
            setProcessing(false);
          } else {
            alert(error.response?.data?.message || "Không thể tạo link thanh toán VNPay");
            setProcessing(false);
          }
        }
      } else if (paymentMethod === "momo") {
        // Mock MoMo payment - simulate thanh toán thành công
        try {
          const paymentResponse = await axios.post(
            "http://localhost:3000/api/payment/mock/process",
            { orderId },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (paymentResponse.data) {
            navigate("/payment/success", { state: { orderId } });
          }
        } catch (error: any) {
          console.error("Error processing MoMo payment:", error);
          alert(error.response?.data?.message || "Thanh toán thất bại");
          setProcessing(false);
        }
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      alert(error.response?.data?.message || "Không thể xử lý thanh toán");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Đang tải thông tin thanh toán...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Không tìm thấy thông tin đơn hàng</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6, maxWidth: "800px" }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <CreditCardIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Thanh toán online
          </Typography>
          <Typography color="text.secondary">
            Mã đơn hàng: <strong>{orderId?.toString().slice(-6).toUpperCase()}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Order Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Thông tin đơn hàng
            </Typography>

            <Box mb={2}>
              <Typography color="text.secondary">Người nhận:</Typography>
              <Typography fontWeight="bold">
                {order.shipping_info?.name}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography color="text.secondary">Địa chỉ:</Typography>
              <Typography>{order.shipping_info?.address}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Tạm tính:</Typography>
              <Typography>{order.subtotal?.toLocaleString("vi-VN")}₫</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Phí ship:</Typography>
              <Typography>
                {order.shipping_fee === 0 ? "Miễn phí" : `${order.shipping_fee?.toLocaleString("vi-VN")}₫`}
              </Typography>
            </Box>

            {order.discount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Giảm giá:</Typography>
                <Typography color="success.main">
                  -{order.discount?.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">
                Tổng tiền:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#d70018">
                {order.total?.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Payment Method Info */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography fontWeight="bold" mb={1}>
            Phương thức thanh toán: {
              paymentMethod === "vnpay" ? "VNPay" :
              paymentMethod === "momo" ? "Ví MoMo" :
              "N/A"
            }
          </Typography>
          {paymentMethod === "vnpay" && (
            <>
              <Typography>
                Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch.
              </Typography>
              <Typography variant="caption" display="block" mt={1} color="warning.main">
                Lưu ý: Nếu VNPay chưa được cấu hình, hệ thống sẽ tự động chuyển sang trang thanh toán mô phỏng để test.
              </Typography>
            </>
          )}
          {paymentMethod === "momo" && (
            <Typography>
              Thanh toán sẽ được xử lý tự động. Vui lòng đợi trong giây lát...
            </Typography>
          )}
        </Alert>

        {/* Payment Button */}
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={processing || order.payment_status === "paid"}
            sx={{
              background: paymentMethod === "vnpay" ? "#1976d2" : "#d70018",
              px: 6,
              py: 1.5,
              fontSize: 18,
              fontWeight: "bold",
              "&:hover": {
                background: paymentMethod === "vnpay" ? "#1565c0" : "#b71c1c"
              }
            }}
          >
            {processing ? (
              <>
                <CircularProgress size={24} sx={{ mr: 2, color: "#fff" }} />
                Đang xử lý...
              </>
            ) : order.payment_status === "paid" ? (
              <>
                <CheckCircleIcon sx={{ mr: 1 }} />
                Đã thanh toán
              </>
            ) : (
              `Thanh toán ${order.total?.toLocaleString("vi-VN")}₫`
            )}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
            sx={{ mt: 2, ml: 2 }}
          >
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentProcess;
