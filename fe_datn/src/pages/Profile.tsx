import { useEffect, useState } from "react";
import { getMeAPI } from "../services/authService";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress
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
        display: "flex",
        justifyContent: "center",
        mt: 6
      }}
    >

      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 400,
          borderRadius: 3,
          textAlign: "center"
        }}
      >

        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2
          }}
        >
          {user.username[0].toUpperCase()}
        </Avatar>

        <Typography variant="h5" fontWeight="bold">
          {user.username}
        </Typography>

        <Typography color="text.secondary" mb={2}>
          {user.email}
        </Typography>

        <Typography>
          <b>ID:</b> {user._id}
        </Typography>

      </Paper>

    </Box>

  );

}
