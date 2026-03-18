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
import { useEffect, useState, MouseEvent } from "react";

import logo3 from "../img/logo3.png";

// ===== TYPE =====
interface User {
  _id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface CartItem {
  quantity: number;
}

const Header: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

<<<<<<< HEAD
  // ================= LOAD CART =================
  const loadCartCount = async () => {

    try {

      const res = await fetch("http://localhost:3000/api/cart");
      const data = await res.json();

      const total = data.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );

      setCartCount(total);

    } catch (error) {

      console.error("Load cart error:", error);

    }

=======
  const loadCartCount = async () => {
    const res = await fetch("http://localhost:3000/cart");
    const data: CartItem[] = await res.json();
    setCartCount(data.reduce((s, i) => s + i.quantity, 0));
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
  };

  useEffect(() => {

    loadCartCount();
<<<<<<< HEAD

    window.addEventListener("storage", loadCartCount);

    return () => {
      window.removeEventListener("storage", loadCartCount);
    };

=======
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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

<<<<<<< HEAD
    <AppBar position="static" sx={{ backgroundColor: "#ffffff" }}>

      {/* TOP HEADER */}
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

          <img
            src={logo3}
            alt="Logo"
            style={{ height: 48 }}
          />

=======
      {/* ===== TOP ===== */}
      <Toolbar sx={{ justifyContent: "space-between", py: 1.2 }}>

        {/* LOGO */}
        <Box component={Link} to="/" sx={{ display: "flex" }}>
          <img src={logo3} alt="logo" style={{ height: 50 }} />
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
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
            "&:hover": {
              backgroundColor: "#eaeaea"
            },
            "&:focus-within": {
              border: "1px solid #ff9800",
              boxShadow: "0 0 0 2px rgba(255,152,0,0.2)"
            }
          }}
        >
          <InputBase
            placeholder="🔍 Tìm sản phẩm bạn muốn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
<<<<<<< HEAD
            sx={{ flex: 1,border: "1px solid #ccc", borderRadius: 3, px: 2, py: 0.5 }}
=======
            sx={{ flex: 1, fontSize: 14 }}
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
          />

          <IconButton onClick={handleSearch}>
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
              gap: 1,
              textDecoration: "none",
<<<<<<< HEAD
              color: "#000000"
            }}
          >

            <PhoneIcon sx={{ color: "#ff9800" }} />

=======
              color: "#333",
              transition: "0.3s",
              "&:hover": { color: "#ff9800" }
            }}
          >
            <PhoneIcon />
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
            <Typography fontSize={14}>
              0987.65.4321
            </Typography>

          </Box>

          {/* ACCOUNT */}
          {user ? (
            <>

              <IconButton onClick={openMenu}>
                <Avatar
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  sx={{
                    border: "2px solid #ff9800"
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >
                <MenuItem onClick={() => { navigate("/my-account"); closeMenu(); }}>
                  👤 Tài khoản
                </MenuItem>

                <MenuItem onClick={() => { navigate("/orders"); closeMenu(); }}>
                  📦 Đơn hàng
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  🚪 Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
<<<<<<< HEAD
              variant="outlined"
              sx={{
                color: "#170000",
                borderColor: "#f19916"
=======
              variant="contained"
              sx={{
                backgroundColor: "#ff9800",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e68900"
                }
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
              }}
            >
              Đăng nhập
            </Button>
          )}

          {/* CART */}
          <IconButton
            component={Link}
            to="/cart"
<<<<<<< HEAD
            sx={{ color: "#f45454" }}
          >

            <Badge
              badgeContent={cartCount}
              color="error"
            >

=======
            sx={{
              color: "#333",
              "&:hover": { color: "#ff9800" }
            }}
          >
            <Badge badgeContent={cartCount} color="error">
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

        </Box>

      </Toolbar>

<<<<<<< HEAD
      {/* MENU NAVIGATION */}
      {/* <Box
        sx={{
          background: "#111",
          display: "flex",
          justifyContent: "center",
          gap: 5,
          py: 1
        }}
      >

        <Button
          component={Link}
          to="/"
          sx={{ color: "#fff" }}
        >
          Trang chủ
        </Button>

        <Button
          component={Link}
          to="/products"
          sx={{ color: "#fff" }}
        >
          Sản phẩm
        </Button>

        <Button
          component={Link}
          to="/news"
          sx={{ color: "#fff" }}
        >
          Tin tức
        </Button>

        <Button
          component={Link}
          to="/about"
          sx={{ color: "#fff" }}
        >
          Giới thiệu
        </Button>

        <Button
          component={Link}
          to="/contact"
          sx={{ color: "#fff" }}
        >
          Liên hệ
        </Button>

      </Box> */}

    </AppBar>
=======
      {/* ===== MENU ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          py: 1.5,
          borderTop: "1px solid #eee"
        }}
      >
        {[
          { label: "Trang chủ", path: "/" },
          { label: "Sản phẩm", path: "/products" },
          { label: "Tin tức", path: "/news" },
          { label: "Giới thiệu", path: "/about" },
          { label: "Liên hệ", path: "/contact" }
        ].map((item) => (
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
              "&:hover::after": {
                width: "80%"
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa

    </AppBar>
  );

};

export default Header;