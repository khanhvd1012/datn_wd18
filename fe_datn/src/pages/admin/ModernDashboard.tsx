import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Inventory,
  LocalOffer,
  Receipt,
  People,
  Article,
  Message,
  MoreVert,
  Category,
  BrandingWatermark,
} from '@mui/icons-material';
import api from '../../services/api';

interface DashboardStats {
  products: number;
  stock: number;
  vouchers: number;
  brands: number;
  categories: number;
  news: number;
  contacts: number;
  orders: number;
}

interface NewsItem {
  _id: string;
  title: string;
  status: string;
  created_at: string;
}

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const ModernDashboard: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactItem[]>([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data one by one to avoid overwhelming the backend
      try {
        const dashboardRes = await api.get('/dashboard');
        console.log('Dashboard API response:', dashboardRes.data);
        
        // Handle different response structures
        const dashboardData = dashboardRes.data.data || dashboardRes.data;
        
        // Extract stats from nested structure or use defaults
        const statsData = {
          products: dashboardData?.products?.total || 0,
          stock: dashboardData?.stock?.totalItems || 0,
          vouchers: dashboardData?.vouchers?.total || 0,
          brands: dashboardData?.brands?.total || 0,
          categories: dashboardData?.categories?.total || 0,
          news: dashboardData?.news?.total || 0,
          contacts: dashboardData?.contacts?.total || 0,
          orders: 0, // Not available in dashboard API yet
        };
        
        setStats(statsData);
      } catch (error) {
        console.warn('Dashboard stats not available, using zeros');
        setStats({
          products: 0,
          stock: 0,
          vouchers: 0,
          brands: 0,
          categories: 0,
          news: 0,
          contacts: 0,
          orders: 0,
        });
      }

      try {
        const categoriesRes = await api.get('/categories');
        const categories = categoriesRes.data;
        const brandsRes = await api.get('/brands');
        const brands = brandsRes.data;
        
        // Update stats with real counts
        setStats(prev => ({
          ...prev,
          categories: Array.isArray(categories) ? categories.length : 0,
          brands: Array.isArray(brands) ? brands.length : 0,
        }));
      } catch (error) {
        console.warn('Could not fetch categories/brands');
      }

      try {
        const newsRes = await api.get('/news?limit=10');
        const news = newsRes.data.data || newsRes.data;
        setRecentNews(Array.isArray(news) ? news.slice(0, 5) : []);
      } catch (error) {
        console.warn('Could not fetch news');
        setRecentNews([]);
      }

      try {
        const contactsRes = await api.get('/contacts?limit=10');
        const contacts = contactsRes.data.data || contactsRes.data;
        setRecentContacts(Array.isArray(contacts) ? contacts.slice(0, 5) : []);
      } catch (error) {
        console.warn('Could not fetch contacts');
        setRecentContacts([]);
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      const message = error.response?.data?.message || 'Không thể tải dữ liệu dashboard';
      setError(message);
      showNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (error || !stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth: 'none' }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button onClick={fetchDashboardData} variant="contained">
          Thử lại
        </Button>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Sản phẩm',
      value: stats.products,
      icon: <ShoppingBag />,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Tồn kho',
      value: stats.stock.toLocaleString('vi-VN'),
      icon: <Inventory />,
      bgColor: alpha(theme.palette.success.main, 0.1),
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Đơn hàng',
      value: stats.orders,
      icon: <Receipt />,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Khuyến mãi',
      value: stats.vouchers,
      icon: <LocalOffer />,
      bgColor: alpha(theme.palette.error.main, 0.1),
      trend: '+15%',
      trendUp: true,
    },
  ];

  const weeklyData = [
    { name: 'T2', products: 12, orders: 8 },
    { name: 'T3', products: 19, orders: 15 },
    { name: 'T4', products: 15, orders: 12 },
    { name: 'T5', products: 25, orders: 20 },
    { name: 'T6', products: 22, orders: 18 },
    { name: 'T7', products: 30, orders: 25 },
    { name: 'CN', products: 28, orders: 22 },
  ];

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 'none' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Tổng quan
        </Typography>
        <Button variant="outlined" startIcon={<TrendingUp />}>
          Xuất báo cáo
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', width: '100%' }}>
        {statCards.map((card, index) => (
          <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' }, minWidth: 250 }}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${card.bgColor} 0%, ${alpha(card.bgColor, 0.5)} 100%)`,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {card.trendUp ? (
                        <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography
                        variant="caption"
                        color={card.trendUp ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 600 }}
                      >
                        {card.trend}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: 'primary.main',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Charts and Activities */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap', width: '100%' }}>
        {/* Line Chart Placeholder */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '2 1 0' }, minWidth: 300 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Xu hướng tuần qua
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Biểu đồ xu hướng (Cần tích hợp thư viện chart)
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Pie Chart Placeholder */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0' }, minWidth: 300 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Trạng thái kho hàng
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Biểu đồ kho hàng (Cần tích hợp thư viện chart)
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Recent Activities */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap', width: '100%' }}>
        {/* Recent News */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0' }, minWidth: 300 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tin tức gần đây
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentNews.map((news) => (
                    <TableRow key={news._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {news.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={news.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                          color={news.status === 'published' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(news.created_at).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Recent Contacts */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0' }, minWidth: 300 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Liên hệ gần đây
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Nội dung</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentContacts.map((contact) => (
                    <TableRow key={contact._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {contact.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contact.message}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Thống kê nhanh
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.2), color: 'info.main', mr: 2 }}>
                  <BrandingWatermark />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.brands}</Typography>
                  <Typography variant="body2" color="text.secondary">Thương hiệu</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.2), color: 'secondary.main', mr: 2 }}>
                  <Category />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.categories}</Typography>
                  <Typography variant="body2" color="text.secondary">Danh mục</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.2), color: 'success.main', mr: 2 }}>
                  <Article />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.news}</Typography>
                  <Typography variant="body2" color="text.secondary">Tin tức</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.2), color: 'warning.main', mr: 2 }}>
                  <Message />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.contacts}</Typography>
                  <Typography variant="body2" color="text.secondary">Liên hệ</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ModernDashboard;
