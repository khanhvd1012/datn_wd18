import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box } from "@mui/material";

const ClientLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",          // thêm
      }}
    >
      <Header />

      {/* Nội dung trang */}
      <Box
        sx={{
          flex: 1,
          width: "100%",        // thêm
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default ClientLayout;