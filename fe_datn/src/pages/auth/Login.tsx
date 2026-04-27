import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../services/authService";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: LoginErrors = {};

    if (!form.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await loginAPI({
        email: form.email,
        password: form.password,
      });

      const user = {
        ...res.user,
        token: res.accessToken,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.accessToken);

      alert("Đăng nhập thành công!");

      // ✅ chuyển về trang chủ + reload
      window.location.href = "/";

    } catch (error: any) {
      alert(error.response?.data?.message || "Không kết nối được server!");
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
            minHeight: 520,
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
              Welcome Back
            </Typography>

            <Typography align="center" sx={{ opacity: 0.9 }}>
              Đăng nhập để tiếp tục mua sắm <br />
              và khám phá sản phẩm mới.
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
              ĐĂNG NHẬP TÀI KHOẢN
            </Typography>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: "bold",
                background: "linear-gradient(90deg,#ff512f,#dd2476)",
                boxShadow: "0 6px 20px rgba(221,36,118,0.4)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(221,36,118,0.6)",
                },
              }}
            >
              ĐĂNG NHẬP
            </Button>

            <Divider sx={{ my: 3 }}>Hoặc</Divider>

            <Typography variant="body2">
              Bạn{" "}
              <Link href="/forgot-password">Quên mật khẩu?</Link>, Chưa có tài khoản?{" "}
              <Link href="/register" underline="hover" sx={{ fontWeight: "bold" }}>
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;