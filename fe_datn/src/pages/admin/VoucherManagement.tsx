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
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  LocalOffer,
  TrendingUp,
  AttachMoney,
  Percent,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import api from '../../services/api';

interface Voucher {
  _id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'inactive';
  createdAt: string;
}

const VoucherManagement: React.FC = () => {
  const theme = useTheme();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    usage_limit: 0,
    used_count: 0,
    start_date: '',
    end_date: '',
    status: 'active',
  });
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
    fetchVouchers();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', (page + 1).toString());
      params.append('limit', rowsPerPage.toString());

      // Fetch vouchers from MongoDB
      const response = await api.get(`/vouchers?${params.toString()}`);
      
      // Handle paginated response or direct array
      const vouchersData = response.data.data || response.data;
      setVouchers(Array.isArray(vouchersData) ? vouchersData : []);
    } catch (error: any) {
      console.error('Error fetching vouchers:', error);
      const message = error.response?.data?.message || 'Không thể tải dữ liệu voucher';
      showNotification(message, 'error');
      setVouchers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, voucher: Voucher) => {
    setAnchorEl(event.currentTarget);
    setSelectedVoucher(voucher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVoucher(null);
  };

  const handleCreateVoucher = () => {
    setDialogMode('create');
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_discount_amount: 0,
      usage_limit: 0,
      used_count: 0,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      status: 'active',
    });
    setOpenDialog(true);
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setDialogMode('edit');
    setFormData({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description,
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value,
      min_order_amount: voucher.min_order_amount ?? 0,
      max_discount_amount: voucher.max_discount_amount ?? 0,
      usage_limit: voucher.usage_limit,
      used_count: voucher.used_count ?? 0,
      start_date: new Date(voucher.start_date).toISOString(),
      end_date: new Date(voucher.end_date).toISOString(),
      status: voucher.status,
    });
    setSelectedVoucher(voucher);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteVoucher = async (voucher: Voucher) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa voucher "${voucher.name}"?`)) {
      try {
        await api.delete(`/vouchers/${voucher._id}`);
        showNotification('Xóa voucher thành công', 'success');
        handleMenuClose();
        fetchVouchers(); // Refresh data
      } catch (error: any) {
        console.error('Error deleting voucher:', error);
        const message = error.response?.data?.message || 'Không thể xóa voucher';
        showNotification(message, 'error');
      }
    }
  };

  const handleSaveVoucher = async () => {
    try {
      const payload = {
      ...formData,
      discount_type: formData.discount_type,
      min_order_amount: formData.min_order_amount ?? 0,
      max_discount_amount: formData.max_discount_amount ?? 0,
    };
    console.log('📤 Save voucher payload:', payload);

    if (dialogMode === 'create') {
        await api.post('/vouchers', payload);
        showNotification('Tạo voucher thành công', 'success');
      } else if (dialogMode === 'edit' && selectedVoucher) {
        await api.put(`/vouchers/${selectedVoucher._id}`, payload);
        showNotification('Cập nhật voucher thành công', 'success');
      }
      setOpenDialog(false);
      fetchVouchers(); // Refresh data
    } catch (error: any) {
      console.error('Error saving voucher:', error);
      const message = error.response?.data?.message || 'Không thể lưu voucher';
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
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'expired':
        return 'Hết hạn';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const voucherStats = {
    total: vouchers.length,
    active: vouchers.filter(v => v.status === 'active').length,
    expired: vouchers.filter(v => v.status === 'expired').length,
    inactive: vouchers.filter(v => v.status === 'inactive').length,
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Quản lý Khuyến mãi
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateVoucher}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {voucherStats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Tổng khuyến mãi
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                <LocalOffer />
              </Avatar>
            </Box>
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
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {voucherStats.active}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Đang hoạt động
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.success.main, width: 56, height: 56 }}>
                <CheckCircle />
              </Avatar>
            </Box>
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
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {voucherStats.expired}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Hết hạn
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.error.main, width: 56, height: 56 }}>
                <Cancel />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {vouchers.reduce((sum, v) => sum + v.used_count, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Lượt đã dùng
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 56, height: 56 }}>
                <TrendingUp />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm khuyến mãi..."
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
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="expired">Hết hạn</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Search />}
            sx={{ height: '56px' }}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Paper>

      {/* Vouchers Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Mã khuyến mãi</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Giá trị</TableCell>
                <TableCell>Điều kiện</TableCell>
                <TableCell>Sử dụng</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                        <LocalOffer fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {voucher.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {voucher.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {voucher.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {voucher.discount_type === 'percentage' ? (
                        <Chip
                          icon={<Percent />}
                          label={`-${voucher.discount_value}%`}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<AttachMoney />}
                          label={`-${voucher.discount_value.toLocaleString('vi-VN')}đ`}
                          color="secondary"
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Tối thiểu: {(voucher.min_order_amount ?? 0).toLocaleString('vi-VN')}đ
                    </Typography>
                    {voucher.max_discount_amount > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Tối đa: {(voucher.max_discount_amount ?? 0).toLocaleString('vi-VN')}đ
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {voucher.used_count}/{voucher.usage_limit}
                      </Typography>
                      <Box sx={{ width: '100%', backgroundColor: 'grey.200', borderRadius: 1, mt: 0.5 }}>
                        <Box
                          sx={{
                            width: `${(voucher.used_count / voucher.usage_limit) * 100}%`,
                            backgroundColor: theme.palette.primary.main,
                            height: 4,
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(voucher.start_date).toLocaleDateString('vi-VN')} - {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(voucher.status)}
                      color={getStatusColor(voucher.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, voucher)}
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
          component="div"
          count={filteredVouchers.length}
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
        <MenuItem onClick={() => selectedVoucher && handleEditVoucher(selectedVoucher)}>
          <Edit sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => selectedVoucher && handleDeleteVoucher(selectedVoucher)}>
          <Delete sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Thêm' : 'Chỉnh sửa'} Khuyến mãi
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Mã khuyến mãi"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
              <TextField
                fullWidth
                label="Tên khuyến mãi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Box>
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá</InputLabel>
                <Select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                  label="Loại giảm giá"
                >
                  <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                  <MenuItem value="fixed_amount">Cố định (VNĐ)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Giá trị giảm"
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Giá trị đơn hàng tối thiểu"
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
              />
              <TextField
                fullWidth
                label="Giảm giá tối đa"
                type="number"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: Number(e.target.value) })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                value={formData.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, start_date: new Date(e.target.value).toISOString() })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                value={formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, end_date: new Date(e.target.value).toISOString() })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              fullWidth
              label="Giới hạn sử dụng"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                />
              }
              label="Kích hoạt khuyến mãi"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveVoucher} variant="contained">
            {dialogMode === 'create' ? 'Thêm' : 'Lưu'}
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

export default VoucherManagement;
