import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../services/authService";
import Footer from "../../components/Footer";

interface FormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
}

interface FormErrors {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  dateOfBirth?: string;
  general?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<FormData>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (form.fullName.trim().length < 2 || form.fullName.trim().length > 50) {
      newErrors.fullName = "Họ và tên phải có từ 2-50 ký tự";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username không được để trống";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Username phải có ít nhất 3 ký tự";
    } else if (form.username.trim().length > 30) {
      newErrors.username = "Username không được quá 30 ký tự";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (form.phone && !/^[0-9()+\-\s]{7,20}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (form.dateOfBirth) {
      const date = new Date(form.dateOfBirth);
      const now = new Date();
      if (isNaN(date.getTime()) || date >= now) {
        newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim() || undefined,
        phone: form.phone.trim() || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        role: "user",
      };

      await registerAPI(payload);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      const data = error.response?.data;
      
      if (data?.errors && Array.isArray(data.errors)) {
        const backendErrors: FormErrors = {};
        data.errors.forEach((err: any) => {
          if (err.field && err.message) {
            backendErrors[err.field as keyof FormErrors] = err.message;
          }
        });
        setErrors(backendErrors);
      } else if (data?.message) {
        setErrors({ general: data.message });
      } else {
        setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#eef2f7,#f8fafc,#ffffff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 430,
            p: 4,
            borderRadius: 3,
            background: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Tạo tài khoản
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Đăng ký thành công! Chuyển đến trang đăng nhập...
            </Alert>
          )}

          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Họ và tên *"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            margin="normal"
            error={!!errors.fullName}
            helperText={errors.fullName}
            disabled={loading || success}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Username *"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
            disabled={loading || success}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading || success}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Mật khẩu *"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading || success}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu *"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={loading || success}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone || "Tùy chọn"}
            disabled={loading || success}
          />

          <TextField
            fullWidth
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            margin="normal"
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth || "Tùy chọn"}
            disabled={loading || success}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || success}
            sx={{
              mt: 3,
              py: 1.3,
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(90deg,#ff512f,#dd2476)",
              boxShadow: "0 6px 20px rgba(221,36,118,0.4)",
              "&:hover": {
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "#ccc",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng ký"
            )}
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                disabled={loading}
                sx={{
                  fontWeight: "bold",
                  color: "#dd2476",
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
