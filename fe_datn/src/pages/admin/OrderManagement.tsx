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
  Grid,
  Tooltip,
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
  Receipt,
  Delete,
  FileDownload,
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
  user_id: any;
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
  const [totalOrders, setTotalOrders] = useState(0);
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
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
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
      
      const response = await api.get('/orders/admin/all', {
        params: {
          search: searchTerm,
          status: statusFilter,
          page: page + 1,
          limit: rowsPerPage
        }
      });
      
      console.log("--- DỮ LIỆU TỪ BACKEND TRẢ VỀ ---");
      console.log(response.data);
      
      const ordersData = response.data.data || response.data || [];
      console.log("Dữ liệu đơn hàng đầu tiên (để check _id):", ordersData[0]);
      
      // Nếu API trả về mảng trực tiếp thay vì bọc trong .data (ví dụ dùng json-server)
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      
      setTotalOrders(response.data.pagination?.total || (Array.isArray(ordersData) ? ordersData.length : 0));
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      const message = error.response?.data?.message || 'Không thể tải dữ liệu đơn hàng';
      showNotification(message, 'error');
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
    // Chú ý: KHÔNG reset selectedOrder ở đây vì các Dialog (Chi tiết, Trạng thái) 
    // vẫn đang cần dữ liệu này để hiển thị và thao tác.
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
    setAnchorEl(null); // Chỉ đóng menu, giữ nguyên selectedOrder
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setNewPaymentStatus(order.payment_status);
    setOpenStatusDialog(true);
    setAnchorEl(null); // Chỉ đóng menu, giữ nguyên selectedOrder
  };

  const handleSaveStatus = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      const orderId = selectedOrder?._id || (selectedOrder as any)?.id;
      console.log("Đang gọi API cập nhật...", orderId, newStatus, newPaymentStatus);
      console.log("Toàn bộ thông tin order:", selectedOrder);
      
      if (orderId) {
        const response = await api.put(`/orders/${orderId}`, { 
          order_status: newStatus,
          payment_status: newPaymentStatus
        });
        console.log("Response từ server:", response.data);
        showNotification('Cập nhật đơn hàng thành công', 'success');
      } else {
        console.error("Không tìm thấy ID của đơn hàng:", selectedOrder);
        showNotification('Lỗi dữ liệu: Đơn hàng không có mã ID', 'error');
      }
      setOpenStatusDialog(false);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      const message = error.response?.data?.message || 'Không thể cập nhật đơn hàng';
      showNotification(message, 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) {
      showNotification('Không tìm thấy mã đơn hàng để xóa', 'error');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await api.delete(`/orders/${orderId}`);
        showNotification('Xóa đơn hàng thành công', 'success');
        fetchOrders();
      } catch (error: any) {
        showNotification(error.response?.data?.message || 'Lỗi khi xóa đơn hàng', 'error');
      }
    }
    handleMenuClose();
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
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'processing': return 'primary';
      case 'shipping': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'COD';
      case 'bank': return 'Chuyển khoản';
      case 'momo': return 'MoMo';
      case 'vnpay': return 'VNPay';
      default: return method;
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

  const paymentStatusOptions = [
    { value: 'pending', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'failed', label: 'Thanh toán thất bại' },
    { value: 'refunded', label: 'Đã hoàn tiền' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e', mb: 0.5 }}>
            Quản lý đơn hàng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi, xử lý và cập nhật trạng thái đơn hàng của khách hàng
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary Panel */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Tổng số đơn', value: totalOrders, icon: <ShoppingBag />, color: '#3f51b5' },
          { label: 'Doanh thu dự kiến', value: formatPrice(orders.reduce((acc, curr) => acc + curr.total, 0)), icon: <AttachMoney />, color: '#4caf50' },
          { label: 'Chờ xử lý', value: orders.filter(o => o.order_status === 'pending').length, icon: <Schedule />, color: '#ff9800' },
          { label: 'Đã hoàn thành', value: orders.filter(o => o.order_status === 'delivered').length, icon: <CheckCircle />, color: '#2e7d32' }
        ].map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Paper sx={{ 
              p: 2.5, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1px solid #edf2f7'
            }}>
              <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, width: 48, height: 48 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filters & Actions Area */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Tìm theo mã đơn, tên hoặc SĐT khách..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1, 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Trạng thái đơn hàng</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái đơn hàng"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Lọc nâng cao">
            <IconButton sx={{ bgcolor: '#f0f2f5', borderRadius: 2 }}>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Mã đơn hàng</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Giá trị</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Thanh toán</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Ngày đặt</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: '#f1f3f9' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Box sx={{ opacity: 0.5 }}>
                      <ShoppingBag sx={{ fontSize: 64, mb: 1.5 }} />
                      <Typography>Không có đơn hàng nào phù hợp</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : orders.map((order) => (
                <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      #{order._id ? order._id.substring(order._id.length - 8).toUpperCase() : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ID: {order._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: theme.palette.primary.main }}>
                        {order.shipping_info.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.shipping_info.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.shipping_info.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {order.order_items.slice(0, 2).map((item, i) => (
                        <Tooltip key={i} title={item.name}>
                          <Avatar 
                            variant="rounded" 
                            src={item.image} 
                            sx={{ width: 32, height: 32, border: '1px solid #eee' }}
                          />
                        </Tooltip>
                      ))}
                      {order.order_items.length > 2 && (
                        <Avatar variant="rounded" sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: '#f0f2f5', color: 'text.secondary' }}>
                          +{order.order_items.length - 2}
                        </Avatar>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatPrice(order.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip
                        label={getPaymentMethodText(order.payment_method)}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                      <Chip
                        label={getPaymentStatusText(order.payment_status)}
                        color={getPaymentStatusColor(order.payment_status)}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(order.order_status)}
                      color={getStatusColor(order.order_status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, order)}
                      size="small"
                      sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
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
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Dòng mỗi trang"
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem onClick={() => selectedOrder && handleViewOrder(selectedOrder)}>
          <Visibility sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} /> Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => selectedOrder && handleChangeStatus(selectedOrder)}>
          <LocalShipping sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} /> Cập nhật trạng thái
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem 
          onClick={() => selectedOrder && handleDeleteOrder(selectedOrder._id || (selectedOrder as any).id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1.5, fontSize: 20 }} /> Xóa đơn hàng
        </MenuItem>
      </Menu>

      {/* Order Detail Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid #eee'
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Chi tiết đơn hàng</Typography>
            <Typography variant="caption" color="text.secondary">Mã đơn: {selectedOrder?._id}</Typography>
          </Box>
          <Chip 
            label={getStatusText(selectedOrder?.order_status || '')} 
            color={getStatusColor(selectedOrder?.order_status || '')}
            sx={{ fontWeight: 600 }}
          />
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Left Column: Customer & Order Info */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" color="primary" /> Thông tin khách hàng
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3, bgcolor: '#fafafa' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Họ tên</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder.shipping_info.name}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Số điện thoại</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder.shipping_info.phone}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">Địa chỉ giao hàng</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder.shipping_info.address}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBag fontSize="small" color="primary" /> Danh sách sản phẩm
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {selectedOrder.order_items.map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      p: 1.5, 
                      borderRadius: 2, 
                      border: '1px solid #eee',
                      alignItems: 'center'
                    }}>
                      <Avatar 
                        variant="rounded" 
                        src={item.image} 
                        sx={{ width: 60, height: 60, border: '1px solid #f0f0f0' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(item.price)} x {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Right Column: Payment & Summary */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment fontSize="small" color="primary" /> Thanh toán
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Hình thức</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{getPaymentMethodText(selectedOrder.payment_method)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Trạng thái thanh toán</Typography>
                    <Chip 
                      label={getPaymentStatusText(selectedOrder.payment_status)} 
                      color={getPaymentStatusColor(selectedOrder.payment_status)}
                      size="small"
                      sx={{ display: 'flex', mt: 0.5, width: 'fit-content' }}
                    />
                  </Box>
                </Paper>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt fontSize="small" color="primary" /> Tổng kết đơn hàng
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f1f3f9' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Tiền hàng</Typography>
                    <Typography variant="body2">{formatPrice(selectedOrder.subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                    <Typography variant="body2">+{formatPrice(selectedOrder.shipping_fee)}</Typography>
                  </Box>
                  {selectedOrder.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Giảm giá</Typography>
                      <Typography variant="body2" color="error">-{formatPrice(selectedOrder.discount)}</Typography>
                    </Box>
                  )}
                  {selectedOrder.coupon_discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Voucher</Typography>
                      <Typography variant="body2" color="error">-{formatPrice(selectedOrder.coupon_discount)}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tổng thanh toán</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                      {formatPrice(selectedOrder.total)}
                    </Typography>
                  </Box>
                </Paper>
                
                {selectedOrder.notes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                      Ghi chú từ khách hàng:
                    </Typography>
                    <Typography variant="body2" sx={{ p: 1.5, bgcolor: '#fdfae9', borderRadius: 1.5, border: '1px solid #f9eebc', fontStyle: 'italic' }}>
                      "{selectedOrder.notes}"
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #eee' }}>
          <Button type="button" onClick={() => setOpenDetailDialog(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Đóng
          </Button>
          <Button 
            type="button"
            variant="contained" 
            onClick={() => {
              setOpenDetailDialog(false);
              selectedOrder && handleChangeStatus(selectedOrder);
            }}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Cập nhật trạng thái
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog 
        open={openStatusDialog} 
        onClose={() => setOpenStatusDialog(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cập nhật đơn hàng</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Thay đổi trạng thái vận đơn và thanh toán cho mã đơn #{selectedOrder?._id ? selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase() : ''}
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Trạng thái đơn hàng"
                sx={{ borderRadius: 2 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Trạng thái thanh toán</InputLabel>
              <Select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                label="Trạng thái thanh toán"
                sx={{ borderRadius: 2 }}
              >
                {paymentStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button type="button" onClick={() => setOpenStatusDialog(false)} sx={{ textTransform: 'none' }}>
            Hủy
          </Button>
          <Button 
            type="button"
            onClick={handleSaveStatus} 
            variant="contained"
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderManagement;
