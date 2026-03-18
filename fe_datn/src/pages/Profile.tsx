import { useEffect, useState } from "react";
import { getMeAPI } from "../services/authService";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Divider,
  Stack
} from "@mui/material";

interface User {
  _id: string;
  email: string;
  username: string;
}

export default function Profile() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMeAPI();
        setUser(data.user);
      } catch (err) {
        console.error("Lỗi lấy profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!user)
    return (
      <Typography textAlign="center" mt={10}>
        Không tìm thấy thông tin người dùng
      </Typography>
    );

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#667eea,#764ba2)"
      }}
    >

      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: 420,
          borderRadius: 5,
          textAlign: "center",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          animation: "fadeUp 0.8s ease"
        }}
      >

        {/* Avatar */}
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            fontSize: 36,
            fontWeight: "bold",
            background: "linear-gradient(45deg,#ff6a00,#ff3d00)",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
          }}
        >
          {user.username[0].toUpperCase()}
        </Avatar>

        {/* Name */}
        <Typography variant="h5" fontWeight="bold">
          {user.username}
        </Typography>

        <Typography color="text.secondary" mb={3}>
          {user.email}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Info */}
        <Stack spacing={2} textAlign="left">

          <Typography>
            <b>User ID:</b> {user._id}
          </Typography>

          <Typography>
            <b>Email:</b> {user.email}
          </Typography>

          <Typography>
            <b>Tên người dùng:</b> {user.username}
          </Typography>

        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Logout */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogout}
          sx={{
            background: "linear-gradient(45deg,#ff6a00,#ff3d00)",
            fontWeight: "bold",
            py: 1.2,
            borderRadius: 2,
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
            }
          }}
        >
          Đăng xuất
        </Button>

      </Paper>

      {/* animation */}
      <style>
        {`
          @keyframes fadeUp {
            from {opacity:0; transform:translateY(40px)}
            to {opacity:1; transform:translateY(0)}
          }
        `}
      </style>

    </Box>

  );
}