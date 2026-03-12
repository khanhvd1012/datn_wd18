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
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import logo3 from "../img/logo3.png";

const Header = () => {

  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    setCartCount(cart.length);

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");
    setUser(null);

    navigate("/");

  };

  const handleSearch = () => {

    if (!search.trim()) return;

    navigate(`/search?q=${search}`);

  };

  const openMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
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
              color: "#fff"
            }}
          >
            <PhoneIcon sx={{ color: "#ff9800" }} />
            <Typography fontSize={14}>
              0987.65.4321
            </Typography>
          </Box>



          {/* LOGIN / ACCOUNT */}
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

            <Badge badgeContent={cartCount} color="error">

              <ShoppingCartIcon />

            </Badge>

          </IconButton>

        </Box>

      </Toolbar>

    </AppBar>

  );
};

export default Header;