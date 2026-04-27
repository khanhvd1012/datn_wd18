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
import ErrorIcon from "@mui/icons-material/Error";

const PaymentFailed = () => {
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
            bgcolor: "#ffebee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3
          }}
        >
          <ErrorIcon
            sx={{
              fontSize: 80,
              color: "#f44336"
            }}
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Thanh toán thất bại
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          {orderId && (
            <>
              <br />
              <strong>Mã đơn hàng: #{orderId.toString().slice(-6).toUpperCase()}</strong>
            </>
          )}
        </Typography>

        <Paper
          sx={{
            bgcolor: "#fff3e0",
            p: 3,
            borderRadius: 2,
            mb: 4,
            textAlign: "left"
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Lưu ý:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Đơn hàng của bạn vẫn được lưu trong hệ thống
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Bạn có thể thử thanh toán lại từ trang đơn hàng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Nếu đã thanh toán, vui lòng liên hệ hỗ trợ
          </Typography>
        </Paper>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
            sx={{ px: 4 }}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              background: "#d70018",
              "&:hover": { background: "#b71c1c" },
              px: 4
            }}
          >
            Về trang chủ
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaymentFailed;
