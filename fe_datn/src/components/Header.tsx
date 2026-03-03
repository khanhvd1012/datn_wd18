import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Badge
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhoneIcon from "@mui/icons-material/Phone";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo3 from "../img/logo3.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#222",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* KHUNG 1280PX CHUẨN */}
      <Box
        sx={{
          maxWidth: 1280,
          width: "100%",
          mx: "auto",
          px: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1.2 }}>

          {/* Logo */}
          <Box component={Link} to="/" sx={{ display: "flex" }}>
            <img src={logo3} alt="Logo" style={{ height: 52 }} />
          </Box>

          {/* Search */}
          <Box
            sx={{
              flex: 1,
              mx: 6,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "30px",
              px: 3,
              height: 48,
            }}
          >
            <InputBase
              placeholder="Nhập mã hoặc tên sản phẩm cần tìm..."
              sx={{ flex: 1 }}
            />
            <IconButton
              sx={{
                backgroundColor: "#ff9800",
                color: "#fff",
                width: 36,
                height: 36,
                "&:hover": {
                  backgroundColor: "#e68900",
                },
              }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              component="a"
              href="tel:0987654321"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#fff",
                textDecoration: "none",
                "&:hover": { color: "#ff9800" },
              }}
            >
              <PhoneIcon />
              <Typography fontSize={14}>
                0987.65.4321
              </Typography>
            </Box>

            {user ? (
              <>
                <Typography sx={{ color: "#fff" }}>
                  Xin chào, {user.name || user.email}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "#ff9800",
                    borderRadius: 20,
                    px: 3,
                    "&:hover": { backgroundColor: "#e68900" },
                  }}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  backgroundColor: "#ff9800",
                  borderRadius: 20,
                  px: 3,
                  "&:hover": { backgroundColor: "#e68900" },
                }}
              >
                Đăng nhập
              </Button>
            )}

            <IconButton
              component={Link}
              to="/cart"
              sx={{ color: "#fff" }}
            >
              <Badge
                badgeContent={cartCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#ff9800",
                    color: "#fff",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;