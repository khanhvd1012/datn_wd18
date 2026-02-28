import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import Footer from "../../components/Footer";
import { loginApi } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {

    e.preventDefault();

    try {

      const res = await loginApi({
        email,
        password,
      });

      console.log("LOGIN SUCCESS:", res);

      // lưu token
      localStorage.setItem(
        "token",
        res.accessToken
      );

      // lưu user
      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );

      alert("Đăng nhập thành công");

      navigate("/");

    } catch (error: any) {

      console.log(error?.response?.data);

      alert(
        error?.response?.data?.message ||
        "Login thất bại"
      );

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
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ flex: 1, pr: 4 }}
          >
            <Typography variant="h5" mb={3} fontWeight="bold">
              ĐĂNG NHẬP
            </Typography>

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            <Button
              type="submit"
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
            >
              ĐĂNG NHẬP
            </Button>

            <Box mt={2}>
              <Link href="#" underline="hover" color="#90caf9">
                Quên mật khẩu
              </Link>
              {" | "}
              <Link
                component={RouterLink}
                to="/register"
                color="error"
                underline="hover"
              >
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
