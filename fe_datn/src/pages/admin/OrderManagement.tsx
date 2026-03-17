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
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  LocalShipping,
  ShoppingBag,
  AttachMoney,
  Person,
  Phone,
  Email,
  LocationOn,
  Payment,
  CheckCircle,
  Cancel,
  Schedule,
  DoneAll,
} from '@mui/icons-material';
import api from '../../services/api';

interface OrderItem {
  product_id: string;
  variant_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  user_id: string;
  order_items: OrderItem[];
  shipping_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  coupon_discount: number;
  total: number;
  coupon_code: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const OrderManagement: React.FC = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
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
    fetchOrders();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', (page + 1).toString());
      params.append('limit', rowsPerPage.toString());

      // Fetch orders from MongoDB
      const response = await api.get(`/orders?${params.toString()}`);
      
      // Handle paginated response or direct array
      const ordersData = response.data.data || response.data;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      const message = error.response?.data?.message || 'Không thể tải dữ liệu đơn hàng';
      showNotification(message, 'error');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
    handleMenuClose();
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setOpenStatusDialog(true);
    handleMenuClose();
  };

  const handleSaveStatus = async () => {
    try {
      if (selectedOrder) {
        await api.put(`/orders/${selectedOrder._id}`, { order_status: newStatus });
        showNotification('Cập nhật trạng thái đơn hàng thành công', 'success');
      }
      setOpenStatusDialog(false);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      const message = error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng';
      showNotification(message, 'error');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'primary';
      case 'shipping':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod':
        return 'COD';
      case 'bank':
        return 'Chuyển khoản';
      case 'momo':
        return 'MoMo';
      case 'vnpay':
        return 'VNPay';
      default:
        return method;
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    processing: orders.filter(o => o.order_status === 'processing').length,
    shipping: orders.filter(o => o.order_status === 'shipping').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length,
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.shipping_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Quản lý đơn hàng
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {orderStats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chờ xác nhận
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {orderStats.processing}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang xử lý
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {orderStats.shipping}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang giao
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {orderStats.delivered}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã giao
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {orderStats.cancelled}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã hủy
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {orderStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng đơn
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ height: '56px' }}
          >
            Bộ lọc nâng cao
          </Button>
        </Box>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Thanh toán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      #{order._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.shipping_info.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.shipping_info.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.total.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip
                        label={getPaymentMethodText(order.payment_method)}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                      <br />
                      <Chip
                        label={getPaymentStatusText(order.payment_status)}
                        color={getPaymentStatusColor(order.payment_status)}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(order.order_status)}
                      color={getStatusColor(order.order_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, order)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem onClick={() => selectedOrder && handleViewOrder(selectedOrder)}>
          <Visibility sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => selectedOrder && handleChangeStatus(selectedOrder)}>
          <LocalShipping sx={{ mr: 1 }} /> Cập nhật trạng thái
        </MenuItem>
      </Menu>

      {/* Order Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn hàng #{selectedOrder?._id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Thông tin khách hàng
                  </Typography>
                  <List dense>
                    <ListItem>
                      <Person sx={{ mr: 1 }} />
                      <ListItemText primary={selectedOrder.shipping_info.name} />
                    </ListItem>
                    <ListItem>
                      <Phone sx={{ mr: 1 }} />
                      <ListItemText primary={selectedOrder.shipping_info.phone} />
                    </ListItem>
                    <ListItem>
                      <Email sx={{ mr: 1 }} />
                      <ListItemText primary={selectedOrder.shipping_info.email} />
                    </ListItem>
                    <ListItem>
                      <LocationOn sx={{ mr: 1 }} />
                      <ListItemText primary={selectedOrder.shipping_info.address} />
                    </ListItem>
                  </List>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Thông tin đơn hàng
                  </Typography>
                  <List dense>
                    <ListItem>
                      <Payment sx={{ mr: 1 }} />
                      <ListItemText primary={`Phương thức: ${getPaymentMethodText(selectedOrder.payment_method)}`} />
                    </ListItem>
                    <ListItem>
                      <AttachMoney sx={{ mr: 1 }} />
                      <ListItemText primary={`Thành tiền: ${selectedOrder.subtotal.toLocaleString('vi-VN')}đ`} />
                    </ListItem>
                    <ListItem>
                      <LocalShipping sx={{ mr: 1 }} />
                      <ListItemText primary={`Phí vận chuyển: ${selectedOrder.shipping_fee.toLocaleString('vi-VN')}đ`} />
                    </ListItem>
                    <ListItem>
                      <AttachMoney sx={{ mr: 1 }} />
                      <ListItemText primary={`Tổng cộng: ${selectedOrder.total.toLocaleString('vi-VN')}đ`} />
                    </ListItem>
                  </List>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Sản phẩm
                </Typography>
                {selectedOrder.order_items.map((item, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Số lượng: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái mới</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Trạng thái mới"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveStatus} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default OrderManagement;
