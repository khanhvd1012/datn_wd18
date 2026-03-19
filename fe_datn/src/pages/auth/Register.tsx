import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../services/authService";
import Footer from "../../components/Footer";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors: RegisterErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    }

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

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        username: form.name,
        email: form.email,
        password: form.password
      });

      if (res.status === 201) {
        alert("Đăng ký thành công");
        navigate("/login");
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#eef2f7,#f8fafc,#ffffff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: 430,
            p: 4,
            borderRadius: 3,
            background: "#fff"
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            textAlign="center"
          >
            Tạo tài khoản
          </Typography>

          <TextField
            fullWidth
            label="Họ và tên"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#666" }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#666" }} />
                </InputAdornment>
              )
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#666" }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#666" }} />
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 3,
              py: 1.3,
              fontWeight: "bold",
              borderRadius: 2,
              background:
                "linear-gradient(90deg,#ff512f,#dd2476)",
              boxShadow: "0 6px 20px rgba(221,36,118,0.4)",
              "&:hover": {
                transform: "translateY(-2px)"
              }
            }}
          >
            Đăng ký
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                sx={{
                  fontWeight: "bold",
                  color: "#dd2476"
                }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Footer />
    </>
  );
};

export default Register;  