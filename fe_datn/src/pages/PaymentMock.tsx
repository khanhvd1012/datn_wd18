import React, { useEffect, useState } from "react";
import { getOrderByIdApi } from "../services/orderService";
import { processMockPaymentApi } from "../services/paymentService";
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
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const PaymentMock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<"success" | "failed" | null>(null);
  const [selectedBank, setSelectedBank] = useState("NCB");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/orders");
        return;
      }

      try {
        const orderData = await getOrderByIdApi(orderId);
        if (orderData) {
          setOrder(orderData);
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

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Simulate successful payment
          const paymentResponse = await processMockPaymentApi({ orderId });

          if (paymentResponse) {
            setPaymentResult("success");
            setTimeout(() => {
              navigate("/payment/success", { state: { orderId } });
            }, 2000);
          }
        } catch (error: any) {
          console.error("Error processing payment:", error);
          setPaymentResult("failed");
          setProcessing(false);
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      setPaymentResult("failed");
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate("/orders");
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
          <AccountBalanceIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Thanh toán online (Mock)
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Đây là trang thanh toán mô phỏng để test. Trong môi trường thực tế, bạn sẽ được chuyển đến cổng thanh toán VNPay/MoMo.
          </Alert>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Order Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Thông tin đơn hàng
            </Typography>

            <Box mb={2}>
              <Typography color="text.secondary">Mã đơn hàng:</Typography>
              <Typography fontWeight="bold">
                {orderId?.toString().slice(-6).toUpperCase()}
              </Typography>
            </Box>

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

        {/* Bank Selection (Mock) */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: "bold", mb: 2 }}>
                Chọn ngân hàng (Mock):
              </FormLabel>
              <RadioGroup
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <FormControlLabel value="NCB" control={<Radio />} label="Ngân hàng Quốc Dân (NCB)" />
                <FormControlLabel value="VCB" control={<Radio />} label="Vietcombank (VCB)" />
                <FormControlLabel value="TCB" control={<Radio />} label="Techcombank (TCB)" />
                <FormControlLabel value="VTB" control={<Radio />} label="Vietinbank (VTB)" />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Payment Result */}
        {paymentResult === "success" && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            Thanh toán thành công! Đang chuyển hướng...
          </Alert>
        )}

        {paymentResult === "failed" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Thanh toán thất bại. Vui lòng thử lại.
          </Alert>
        )}

        {/* Payment Button */}
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={processing || order.payment_status === "paid" || paymentResult === "success"}
            sx={{
              background: "#1976d2",
              px: 6,
              py: 1.5,
              fontSize: 18,
              fontWeight: "bold",
              "&:hover": {
                background: "#1565c0"
              }
            }}
          >
            {processing ? (
              <>
                <CircularProgress size={24} sx={{ mr: 2, color: "#fff" }} />
                Đang xử lý thanh toán...
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
            onClick={handleCancel}
            sx={{ mt: 2, ml: 2 }}
            disabled={processing}
          >
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentMock;
