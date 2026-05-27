import { Outlet } from "react-router-dom";
 import Header from "../components/Header"; 
 import Footer from "../components/Footer"; 
 import { Box, Toolbar } from "@mui/material";
  import AiChatWidget from "../components/AiChatWidget";
 import CompareBar from "../components/compare/CompareBar";
  const ClientLayout = () => { 
    return ( 
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff", }} >
       {/* HEADER FIXED */} 
       <Header />
        {/* Spacer tránh content bị header đè */}
         <Toolbar sx={{ minHeight: "55px !important", }} />
          {/* PAGE CONTENT */} <Box sx={{ flex: 1, width: "100%", }} >
             <Outlet /> 
             </Box> {/* AI CHAT */} 
             <AiChatWidget />
             <CompareBar />
              {/* FOOTER */} 
              <Footer />
               </Box> ); };
                export default ClientLayout;