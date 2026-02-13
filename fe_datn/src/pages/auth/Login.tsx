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

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${form.email}&password=${form.password}`
      );

      if (res.data.length > 0) {
        localStorage.setItem("user", JSON.stringify(res.data[0]));
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("Sai email hoặc mật khẩu!");
      }
    } catch (error) {
      console.error(error);
      alert("Không kết nối được server!");
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
            display: "flex",
            p: 4,
            backgroundColor: "#121212",
            color: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          <Box sx={{ flex: 1, pr: 4 }}>
            <Typography variant="h5" mb={3} fontWeight="bold">
              ĐĂNG NHẬP
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
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
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
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            <Button
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                backgroundColor: "#e65100",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#ef6c00",
                },
              }}
              variant="contained"
              onClick={handleSubmit}
            >
              ĐĂNG NHẬP
            </Button>

            <Box mt={2}>
              <Link href="#" underline="hover" color="#90caf9">
                Quên mật khẩu
              </Link>
              {" | "}
              <Link href="/register" color="error" underline="hover">
                Đăng ký tài khoản mới
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Footer />
    </>
  );
};

export default Login;
