import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: 4,
            backgroundColor: "rgba(0,0,0,0.35)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <Typography
            sx={{
              fontSize: "140px",
              fontWeight: 800,
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Trang không tồn tại
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              opacity: 0.8,
              mb: 4,
            }}
          >
            Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.
          </Typography>

          <Button
            component={Link}
            to="/"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#ff9800",
              color: "#000",
              borderRadius: "30px",
              "&:hover": {
                backgroundColor: "#ffa726",
              },
            }}
          >
            Quay về trang chủ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
