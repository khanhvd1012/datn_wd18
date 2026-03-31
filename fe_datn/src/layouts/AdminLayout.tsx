import { AppBar, Box, Button, Divider, Drawer, List, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const AdminLayout = () => {
  const navigate = useNavigate();
  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Banner", path: "/admin/banner" },
    { name: "Category", path: "/admin/category" },
    { name: "Orders", path: "/admin/orders" },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Admin Portal</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", marginTop: "64px" },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menu.map((item) => (
            <ListItemButton key={item.path} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px", marginLeft: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
