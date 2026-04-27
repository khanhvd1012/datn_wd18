import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || location.search?.split("orderId=")[1];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center"
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: "#e8f5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "#4caf50"
            }}
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Thanh toán thành công!
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          {orderId && (
            <>
              <br />
              <strong>Mã đơn hàng: #{orderId.toString().slice(-6).toUpperCase()}</strong>
            </>
          )}
        </Typography>

        <Box
          sx={{
            bgcolor: "#f5f5f5",
            p: 3,
            borderRadius: 2,
            mb: 4
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <LocalShippingIcon color="action" />
            <Typography fontWeight="bold">
              Đơn hàng sẽ được giao trong 2-5 ngày làm việc
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{ px: 4 }}
          >
            Tiếp tục mua
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
            sx={{
              background: "#4caf50",
              "&:hover": { background: "#388e3c" },
              px: 4
            }}
          >
            Xem đơn hàng
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
