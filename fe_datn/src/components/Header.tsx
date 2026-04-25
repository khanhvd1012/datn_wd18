import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Button,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getCartApi } from "../services/cartService";

import logo3 from "../img/logo3.png";

const Header = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);

  const [openMega, setOpenMega] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const closeTimeout = useRef<any>(null);

  // ================= LOAD CATEGORIES =================
  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  // ================= DEFAULT CATEGORY LOAD =================
  useEffect(() => {
    if (categories.length > 0) {
      const first = categories[0];
      setActiveCategory(first);
      loadProducts(first._id);
    }
  }, [categories]);

  // ================= LOAD USER =================
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // ================= CART =================
  const loadCart = async () => {
    try {
      const data = await getCartApi();
      setCartCount(data.reduce((s: number, i: any) => s + i.quantity, 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  // ================= SEARCH =================
  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?search=${search}`);
  };

  // ================= LOAD PRODUCTS =================
  const loadProducts = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products?category=${id}`
      );
      const data = await res.json();
      setProducts(data || []);
    } catch {
      setProducts([]);
    }
  };

  // ================= HOVER CONTROL =================
  const handleEnter = () => {
    clearTimeout(closeTimeout.current);
    setOpenMega(true);
  };

  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenMega(false);
      setActiveCategory(null);
    }, 150);
  };

  return (
    <AppBar position="static" sx={{ background: "#fff" }}>

      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* LOGO */}
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center" }}>
          <img src={logo3} style={{ height: 48 }} />
        </Box>

        {/* SEARCH + MENU */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flex: 1, mx: 4,paddingLeft:"15px"  }}>

          {/* SEARCH */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: 3,
            px: 2,
            width: 250,
            
          }}>
            <InputBase
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              sx={{ flex: 1 }}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* NAV */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center",paddingLeft:"45px" }}>

            <Button component={Link} to="/" sx={navStyle}>
              TRANG CHỦ
            </Button>

            {/* CATEGORY MEGA MENU */}
            <Box
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              sx={{ position: "relative" }}
            >
              <Button sx={navStyle}>
                DANH MỤC
              </Button>

              {/* MEGA MENU */}
              <Box
                sx={{
                  position: "absolute",
                  marginTop:"10px",
                  top: "100%",
                  left: -50,
                  width: "200px",
                  height: "auto",
                  bgcolor: "#f5f3f3",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                  display: "flex",
                  borderRadius: "10px",
                  zIndex: 9999,

                  opacity: openMega ? 1 : 0,
                  visibility: openMega ? "visible" : "hidden",
                  transform: openMega ? "translateY(0px)" : "translateY(10px)",
                  transition: "all 0.55s ease"
                }}
              >

                <Box sx={{ width: 240, borderRight: "1px solid #eee" }}>
                {categories.map((cat) => (
                  <Box
                    key={cat._id}
                    onMouseEnter={() => {
                      setActiveCategory(cat);
                      loadProducts(cat._id);
                    }}
                    onClick={() => navigate(`/products?category=${cat._id}`)}
                    sx={{
                      px: 2,
                      py: 1,
                      fontSize: 16,
                      color: "#000",
                      cursor: "pointer",
                      transition: "0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",

                      "&:hover": {
                        background: "#f5f5f5",
                        borderLeft: "3px solid #5bec6f"
                      }
                    }}
                  >
                    {cat.name}
                  </Box>
                ))}
              </Box>

               

              </Box>
            </Box>

            <Button component={Link} to="/support" sx={navStyle}>
              HỖ TRỢ
            </Button>

            {!user && (
              <Button component={Link} to="/login" sx={navStyle}>
                ĐĂNG NHẬP
              </Button>
            )}

          </Box>

        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2,  }}>

          {user && (
            < >
            <div style={{display:"flex",}}>
            <p style={{
              color: "black",
              fontSize: 14,
              marginTop: 14,
              whiteSpace: "nowrap"
            }} >Xin chào, {user.username}</p>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}
                 sx={{ p: 0.5 }}
                >
                <Avatar src={user.avatar}  />
              </IconButton>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => navigate("/my-account")}>Tài khoản</MenuItem>
                <MenuItem onClick={() => navigate("/orders")}>Đơn hàng</MenuItem>
                <MenuItem onClick={() => { localStorage.removeItem("user"); setUser(null); }}>
                  Đăng xuất
                </MenuItem>
              </Menu>
              </div>
            </>
          )}

          <IconButton component={Link} to="/cart">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon sx={{color:"#f1bd7e"}} />
            </Badge>
          </IconButton>

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;

// ================= STYLE =================
const navStyle = {
  color: "#000000",
  width: "126px",
  textTransform: "none",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "0%",
    height: "2px",
    backgroundColor: "#f19916",
    transition: "0.3s"
  },
  "&:hover::after": {
    width: "100%"
  }
};