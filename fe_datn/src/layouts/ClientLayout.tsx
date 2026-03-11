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
      }}
    >
      {/* HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
};

export default ClientLayout;