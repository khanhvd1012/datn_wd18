import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Container } from "@mui/material";

const ClientLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f7",
      }}
    >
      <Header />

      {/* Nội dung trang */}
      <Box sx={{ flex: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default ClientLayout;