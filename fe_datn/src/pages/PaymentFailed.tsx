import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const PaymentFailed = () => {
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
        <ErrorIcon
          sx={{
            fontSize: 90,
            color: "#f44336",
            mb: 2
          }}
        />

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Thanh toán thất bại
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
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
            onClick={() => navigate("/orders")}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              background: "#f44336",
              "&:hover": { background: "#d32f2f" }
            }}
          >
            Về trang chủ
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PaymentFailed;
