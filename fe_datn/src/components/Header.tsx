import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhoneIcon from "@mui/icons-material/Phone";
import { Link } from "react-router-dom";
import logo3 from "../img/logo3.png";
const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#222" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none"
          }}
        >
          <img
            src={logo3}    
            alt="Logo"
            style={{
              height: 48,    
              objectFit: "contain"
            }}
          />
        </Box>


        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 3,
            px: 3,
            width: 600,
            mx: 4
          }}
        >
          <InputBase
            placeholder="Nhập mã hoặc tên sản phẩm cần tìm?"
            sx={{ flex: 1 }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
          
          {/* Phone with animation + link */}
          <Box
            component="a"
            href="tel:0987654321"
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textDecoration: "none",
                color: "#fff",
                "&:hover": {
                color: "#ffffca",
                },
            }}
            >
            <PhoneIcon
                sx={{
                color: "#ff9800",
                animation: "pulse 2.5s infinite ease-in-out",
                }}
            />
            <Typography fontSize={14}>0987.65.4321</Typography>
            </Box>


          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#ff9800" }}
          >
            Đăng nhập
          </Button>

          <IconButton
            component={Link}
            to="/cart"
            sx={{ color: "#ded2ac" }}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </AppBar>
  );
};

export default Header;
