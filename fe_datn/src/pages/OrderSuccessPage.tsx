import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "#4caf50",
            mb: 3,
          }}
        />
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Đặt hàng thành công!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
            sx={{ minWidth: 150 }}
          >
            Xem đơn hàng
          </Button>          
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              minWidth: 150,
              background: "linear-gradient(90deg,#ff512f,#dd2476)",
              "&:hover": {
                background: "linear-gradient(90deg,#e94426,#c21d64)",
              },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;
