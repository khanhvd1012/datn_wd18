import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { forgotPasswordAPI } from "../../services/authService";
import { Link, Link as RouterLink } from "react-router-dom";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await forgotPasswordAPI(email);
      alert("Đã gửi email khôi phục!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        py: 6,
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 2 }}>
        <Paper
          elevation={10}
          sx={{
            minHeight: 500,
            display: "flex",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* LEFT */}
          <Box
            sx={{
              flex: 1,
              background:
                "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/smartphone_2025_4f932a1994.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 5,
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Reset Password
            </Typography>

            <Typography align="center" sx={{ opacity: 0.9 }}>
              Nhập email để nhận link <br />
              đặt lại mật khẩu.
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              backgroundColor: "#fff",
              p: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={3}>
              QUÊN MẬT KHẨU
            </Typography>

            <TextField
              fullWidth
              label="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.3,
                mb: 7,
                fontWeight: "bold",
                background: "linear-gradient(90deg,#ff512f,#dd2476)",
                boxShadow: "0 6px 20px rgba(221,36,118,0.4)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(221,36,118,0.6)",
                },
              }}
            >
              GỬI YÊU CẦU
            </Button>
           <Typography variant="body2">
            Quay lại{" "}
            <Link
                component={RouterLink}
                to="/login"
                sx={{ fontWeight: 500 , }}
            >
                Đăng nhập
            </Link>
            , chưa có tài khoản?{" "}
            <Link
                component={RouterLink}
                to="/register"
                sx={{ fontWeight: "bold", color: "#dd2476" }}
            >
                Đăng ký ngay
            </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}