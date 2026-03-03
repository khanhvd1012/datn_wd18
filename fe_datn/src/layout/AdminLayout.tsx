import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", path: "/admin" },
  { text: "Products", path: "/admin/products" },
  { text: "Categories", path: "/admin/categories" },
  { text: "Vouchers", path: "/admin/vouchers" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function lấy title theo path
  const getTitle = () => {
    const current = menuItems.find(
      (item) => item.path === location.pathname
    );

    if (current) {
      return `admin ${current.text}`;
    }

    // fallback nếu là route con ví dụ /admin/products/create
    if (location.pathname.startsWith("/admin/products"))
      return "Admin Products";

    if (location.pathname.startsWith("/admin/categories"))
      return "Admin Categories";

    if (location.pathname.startsWith("/admin/vouchers"))
      return "Admin Vouchers";

    return "Admin Dashboard";
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        <Toolbar>
          <Typography variant="h6">ADMIN</Typography>
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" fontWeight="bold">
              {getTitle()}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;