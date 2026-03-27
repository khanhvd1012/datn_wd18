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
import { useEffect, useState } from "react";

import logo3 from "../img/logo3.png";

const Header = () => {

  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  // ================= LOAD USER =================
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  // ================= LOAD CART =================
  const loadCartCount = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const token = JSON.parse(user).token;
      const res = await fetch("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setCartCount(0);
        return;
      }

      const data = await res.json();
      const total = Array.isArray(data)
        ? data.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
        : 0;
      setCartCount(total);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {

    loadCartCount();

    window.addEventListener("storage", loadCartCount);

    return () => {
      window.removeEventListener("storage", loadCartCount);
    };

  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {

    localStorage.removeItem("user");
    setUser(null);

    navigate("/");

  };

  // ================= SEARCH =================
  const handleSearch = () => {

    if (!search.trim()) return;

    navigate(`/products?search=${search}`);

  };

  const openMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (

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
            placeholder="Nhập tên sản phẩm cần tìm?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1,border: "1px solid #ccc", borderRadius: 3, px: 2, py: 0.5 }}
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
              gap: 0.5,
              textDecoration: "none",
              color: "#000000"
            }}
          >

            <PhoneIcon sx={{ color: "#ff9800" }} />

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
                />

              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >

                <MenuItem
                  onClick={() => {
                    navigate("/my-account");
                    closeMenu();
                  }}
                >
                  Tài khoản
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/orders");
                    closeMenu();
                  }}
                >
                  Đơn hàng
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  Đăng xuất
                </MenuItem>

              </Menu>

            </>

          ) : (

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: "#170000",
                borderColor: "#f19916"
              }}
            >
              Đăng nhập
            </Button>

          )}

          {/* CART */}
          <IconButton
            component={Link}
            to="/cart"
            sx={{ color: "#f45454" }}
          >

            <Badge
              badgeContent={cartCount}
              color="error"
            >

              <ShoppingCartIcon />

            </Badge>

          </IconButton>

        </Box>

      </Toolbar>

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

  );

};

export default Header;