import React from "react";
import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminLayout = () => {

  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Banner", path: "/admin/banner" },
    { name: "Category", path: "/admin/category" },
  ];

  return (
    <Box sx={{ display: "flex" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": { width: drawerWidth }
        }}
      >
        <List>

          {menu.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemText primary={item.name}/>
            </ListItemButton>
          ))}

        </List>

      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet/>
      </Box>

    </Box>
  );
};

export default AdminLayout;