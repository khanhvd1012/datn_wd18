import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Badge,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhoneIcon from "@mui/icons-material/Phone";

import { Link, useNavigate } from "react-router-dom";
import { MouseEvent, useEffect, useState } from "react";
import logo3 from "../img/logo3.png";

import { useUser } from "../context/UserContext";

interface CartItem {
  quantity: number;
}

const Header: React.FC = () => {
  const { user, setUser } = useUser(); // lấy user từ Context
  const [cartCount, setCartCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  // Load cart count
  const loadCartCount = async () => {
    try {
      const res = await fetch("http://localhost:3000/cart");
      const data: CartItem[] = await res.json();
      setCartCount(data.reduce((s, i) => s + i.quantity, 0));
    } catch (err) {
      console.log("Error loading cart", err);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // cập nhật Context
    navigate("/");
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?search=${search}`);
  };

  const openMenu = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(to right, #ffffff, #fafafa)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}
    >
      {/* TOP BAR */}
      <Toolbar sx={{ justifyContent: "space-between", py: 1.2 }}>
        {/* LOGO */}
        <Box component={Link} to="/" sx={{ display: "flex" }}>
          <img src={logo3} alt="logo" style={{ height: 50 }} />
        </Box>

        {/* SEARCH */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f3f4",
            borderRadius: "30px",
            px: 3,
            width: 600,
            mx: 4,
            transition: "0.3s",
            border: "1px solid transparent",
            "&:hover": { backgroundColor: "#eaeaea" },
            "&:focus-within": { border: "1px solid #ff9800", boxShadow: "0 0 0 2px rgba(255,152,0,0.2)" }
          }}
        >
          <InputBase
            placeholder="🔍 Tìm sản phẩm bạn muốn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: 14 }}
          />
          <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
        </Box>

        {/* RIGHT ACTIONS */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            minWidth: 250, // giữ khoảng trống đủ
            justifyContent: "flex-end" // luôn nằm bên phải
          }}
        >
          {/* PHONE */}
          <Box
            component="a"
            href="tel:0987654321"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "#333",
              transition: "0.3s",
              "&:hover": { color: "#ff9800" }
            }}
          >
            <PhoneIcon />
            <Typography fontSize={14}>0987.65.4321</Typography>
          </Box>

          {/* ACCOUNT */}
          {user ? (
            <>
              <IconButton onClick={openMenu}>
                <Avatar
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  sx={{ border: "2px solid #ff9800" }}
                />
              </IconButton>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                <MenuItem onClick={() => { navigate("/my-account"); closeMenu(); }}>👤 Tài khoản</MenuItem>
                <MenuItem onClick={() => { navigate("/orders"); closeMenu(); }}>📦 Đơn hàng</MenuItem>
                <MenuItem onClick={handleLogout}>🚪 Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                backgroundColor: "#ff9800",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#e68900" }
              }}
            >
              Đăng nhập
            </Button>
          )}

          {/* CART */}
          <IconButton component={Link} to="/cart" sx={{ color: "#333", "&:hover": { color: "#ff9800" } }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>

      {/* MAIN MENU */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 6, py: 1.5, borderTop: "1px solid #eee" }}>
        {[
          { label: "Trang chủ", path: "/" },
          { label: "Sản phẩm", path: "/products" },
          { label: "Tin tức", path: "/news" },
          { label: "Giới thiệu", path: "/about" },
          { label: "Liên hệ", path: "/contact" }
        ].map(item => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              color: "#333",
              fontWeight: 500,
              position: "relative",
              "&:hover": { color: "#ff9800" },
              "&::after": {
                content: '""',
                position: "absolute",
                width: "0%",
                height: "3px",
                bottom: -2,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#ff9800",
                borderRadius: 2,
                transition: "0.3s"
              },
              "&:hover::after": { width: "80%" }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </AppBar>
  );
};

export default Header;