import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        p: 3
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          maxWidth: 500,
          width: "100%"
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 90,
            color: "#4caf50",
            mb: 2
          }}
        />

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Thanh toán thành công!
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          {orderId && (
            <>
              <br />
              <strong>Mã đơn hàng: {orderId.slice(-6).toUpperCase()}</strong>
            </>
          )}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
            sx={{
              background: "#4caf50",
              "&:hover": { background: "#388e3c" }
            }}
          >
            Xem đơn hàng
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PaymentSuccess;
