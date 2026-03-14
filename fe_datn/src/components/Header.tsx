import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhoneIcon from "@mui/icons-material/Phone";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import logo3 from "../img/logo3.png";

const Header = () => {

  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Load user khi component mount
    loadUser();

    // Lắng nghe sự thay đổi trong localStorage
    const handleStorageChange = (e: any) => {
      if (e.key === "user") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe custom event từ Login page
    const handleLoginSuccess = () => {
      loadUser();
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    // Delay đóng menu để có thời gian di chuột vào menu
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    menuTimeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 150);
  };

  const handleMenuEnter = () => {
    // Hủy timeout đóng menu khi di chuột vào menu
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Xóa token khi logout
    setUser(null);
    setAnchorEl(null);
    navigate("/");
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#222" }}>

      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* LOGO */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none"
          }}
        >
          <img src={logo3} alt="Logo" style={{ height: 48 }} />
        </Box>

        {/* SEARCH */}
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

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>

          {/* PHONE */}
          <Box
            component="a"
            href="tel:0987654321"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              textDecoration: "none",
              color: "#fff"
            }}
          >
            <PhoneIcon sx={{ color: "#ff9800" }} />
            <Typography fontSize={14}>
              0987.65.4321
            </Typography>
          </Box>

          {/* ORDERS */}
          {user && (
            <Button
              component={Link}
              to="/orders"
              startIcon={<ReceiptLongIcon />}
              sx={{ color: "#fff" }}
            >
              Đơn hàng
            </Button>
          )}

          {/* LOGIN / LOGOUT */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                onMouseEnter={handleMenuOpen}
                onClick={handleMenuOpen}
                sx={{
                  color: "#ff9800",
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline"
                  },
                  py: 1,
                  px: 1
                }}
              >
                {user.username || user.email}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  onMouseLeave: handleMenuClose,
                  onMouseEnter: handleMenuEnter
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  },
                  onMouseEnter: handleMenuEnter,
                  onMouseLeave: handleMenuClose
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Tài khoản cá nhân
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#ff9800" }}
            >
              Đăng nhập
            </Button>
          )}

          {/* CART */}
          <IconButton
            component={Link}
            to="/cart"
            sx={{ color: "#ded2ac" }}
          >
            <ShoppingCartIcon />
          </IconButton>

        </Box>

      </Toolbar>

    </AppBar>
  );
};

export default Header;