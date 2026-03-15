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
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        p: 3
      }}
    >

      <Paper
        elevation={5}
        sx={{
          p: 5,
          width: 420,
          borderRadius: 4,
          textAlign: "center"
        }}
      >

        {/* Avatar */}
        <Avatar
          sx={{
            width: 90,
            height: 90,
            mx: "auto",
            mb: 2,
            fontSize: 32,
            background: "#ff5722"
          }}
        >
          {user.username[0].toUpperCase()}
        </Avatar>

        {/* Name */}
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={1}
        >
          {user.username}
        </Typography>

        <Typography
          color="text.secondary"
          mb={3}
        >
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
            background: "#ff5722",
            fontWeight: "bold",
            "&:hover": { background: "#e64a19" }
          }}
        >
          Đăng xuất
        </Button>

      </Paper>

    </Box>

  );

}