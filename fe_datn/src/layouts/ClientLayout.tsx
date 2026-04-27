import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import AiChatWidget from "../components/AiChatWidget";

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
<AiChatWidget />
      {/* FOOTER */}
      <Footer />
    </Box>
  );
};

export default ClientLayout;