import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

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
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // 1️⃣ Kiểm tra email đã tồn tại chưa
      const checkUser = await axios.get(
        `http://localhost:3000/users?email=${form.email}`
      );

      if (checkUser.data.length > 0) {
        alert("Email đã tồn tại!");
        return;
      }

      // 2️⃣ Tạo user mới
      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      await axios.post("http://localhost:3000/users", newUser);

      alert("Đăng ký thành công!");

      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Lỗi đăng ký! Kiểm tra json-server.");
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "600px",
          background: "linear-gradient(135deg, #1f1f1f, #2b2b2b)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid rgba(255,255,255,0.35)",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: 900,
            p: 4,
            backgroundColor: "#121212",
            color: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          <Typography variant="h5" mb={3} fontWeight="bold">
            ĐĂNG KÝ
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
          />

          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#e65100",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#ef6c00" },
            }}
            variant="contained"
            onClick={handleSubmit}
          >
            ĐĂNG KÝ
          </Button>

          <Box mt={2}>
            <Typography variant="body2">
              Đã có tài khoản?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                underline="hover"
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
