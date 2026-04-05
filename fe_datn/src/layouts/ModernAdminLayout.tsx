import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  ShoppingBag,
  Category,
  BrandingWatermark,
  LocalOffer,
  Inventory,
  Receipt,
  Article,
  Image,
  Message,
  People,
  Menu as MenuIcon,
  ChevronLeft,
  Notifications,
  Settings,
  Logout,
  AccountCircle,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Star as StarIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  {
    title: 'Tổng quan',
    path: '/admin',
    icon: <Dashboard />,
    badge: 0,
  },
  {
    title: 'Sản phẩm & Biến thể',
    path: '/admin/product-variants',
    icon: <ShoppingBag />,
    badge: 0,
  },
  {
    title: 'Danh mục và Thương hiệu',
    path: '/admin/categories',
    icon: <Category />,
    badge: 0,
  },
  {
    title: 'Đơn hàng',
    path: '/admin/orders',
    icon: <Receipt />,
    badge: 0,
  },
  {
    title: 'Khuyến mãi',
    path: '/admin/vouchers',
    icon: <LocalOffer />,
    badge: 0,
  },
  {
    title: 'Tin tức',
    path: '/admin/news',
    icon: <Article />,
    badge: 0,
  },
  {
    title: 'Banner',
    path: '/admin/banners',
    icon: <Image />,
    badge: 0,
  },
  {
    title: 'Phản hồi',
    path: '/admin/contacts',
    icon: <Message />,
    badge: 0,
  },
  {
    title: 'Đánh giá',
    path: '/admin/reviews',
    icon: <StarIcon />,
    badge: 0,
  },
  {
    title: 'Người dùng',
    path: '/admin/users',
    icon: <People />,
    badge: 0,
  },
];

const ModernAdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    handleProfileMenuClose();
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: 2.5,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Admin Portal
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
              selected={
                location.pathname === item.path ||
                (item.path === '/admin/categories' && location.pathname === '/admin/brands')
              }
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: (location.pathname === item.path || (item.path === '/admin/categories' && location.pathname === '/admin/brands')) ? 'inherit' : 'text.secondary',
                }}
              >
                {item.badge > 0 ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: (location.pathname === item.path || (item.path === '/admin/categories' && location.pathname === '/admin/brands')) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <TrendingUp sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Hệ thống Quản trị Mobitech
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Thông báo">
              <IconButton color="inherit">
                <Badge badgeContent={0} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Cài đặt">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title="Tài khoản">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => navigate('/admin/profile')}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Hồ sơ cá nhân
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            },
            display: { xs: 'block', md: 'none' },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{
          flex: 1,
          width: '100%',
          maxWidth: 'none',
          overflowX: 'auto',
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ModernAdminLayout;
