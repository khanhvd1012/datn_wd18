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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Add,
  Inventory,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';

interface StockItem {
  _id: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  quantity: number;
  reserved: number;
  available: number;
  min_quantity: number;
  max_quantity: number;
  location: string;
  last_updated: string;
}

const InventoryManagement: React.FC = () => {
  const theme = useTheme();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    fetchStockItems();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockStockItems: StockItem[] = [
        {
          _id: '1',
          product_id: 'prod1',
          product_name: 'iPhone 15 Pro',
          variant_id: 'var1',
          variant_name: '256GB Natural Titanium',
          quantity: 50,
          reserved: 5,
          available: 45,
          min_quantity: 10,
          max_quantity: 100,
          location: 'Kho A - Tầng 1',
          last_updated: new Date().toISOString(),
        },
        {
          _id: '2',
          product_id: 'prod2',
          product_name: 'Samsung Galaxy S24',
          variant_id: 'var2',
          variant_name: '128GB Black',
          quantity: 8,
          reserved: 2,
          available: 6,
          min_quantity: 10,
          max_quantity: 50,
          location: 'Kho B - Tầng 2',
          last_updated: new Date().toISOString(),
        },
      ];
      setStockItems(mockStockItems);
    } catch (error) {
      console.error('Error fetching stock items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: StockItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleViewItem = (item: StockItem) => {
    setSelectedItem(item);
    setOpenDetailDialog(true);
    handleMenuClose();
  };

  const handleEditItem = (item: StockItem) => {
    setSelectedItem(item);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStockStatus = (item: StockItem) => {
    if (item.available === 0) return { color: 'error', text: 'Hết hàng', icon: <Warning /> };
    if (item.available <= item.min_quantity) return { color: 'warning', text: 'Sắp hết', icon: <TrendingDown /> };
    if (item.available >= item.max_quantity * 0.8) return { color: 'info', text: 'Tồn kho cao', icon: <TrendingUp /> };
    return { color: 'success', text: 'Bình thường', icon: <CheckCircle /> };
  };

  const stockStats = {
    total: stockItems.length,
    lowStock: stockItems.filter(item => item.available <= item.min_quantity).length,
    outOfStock: stockItems.filter(item => item.available === 0).length,
    totalValue: stockItems.reduce((sum, item) => sum + item.available * 1000000, 0), // Mock price
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.variant_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || getStockStatus(item).text === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Quản lý kho hàng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
        >
          Nhập hàng
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
              {stockStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng sản phẩm
            </Typography>
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
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {stockStats.lowStock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sắp hết hàng
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
              {stockStats.outOfStock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hết hàng
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
              {(stockStats.totalValue / 1000000).toFixed(0)}M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng giá trị
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
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
              <MenuItem value="Bình thường">Bình thường</MenuItem>
              <MenuItem value="Sắp hết">Sắp hết</MenuItem>
              <MenuItem value="Hết hàng">Hết hàng</MenuItem>
              <MenuItem value="Tồn kho cao">Tồn kho cao</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ height: '56px' }}
          >
            Bộ lọc
          </Button>
        </Box>
      </Paper>

      {/* Stock Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Biến thể</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Đã đặt</TableCell>
                <TableCell>Còn lại</TableCell>
                <TableCell>Vị trí</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.product_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.variant_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.reserved}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: status.color + '.main' }}>
                        {item.available}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.text}
                        sx={{ backgroundColor: status.color, color: '#fff' }}
                        size="small"
                        icon={status.icon}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, item)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
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
        <MenuItem onClick={() => selectedItem && handleViewItem(selectedItem)}>
          <Visibility sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => selectedItem && handleEditItem(selectedItem)}>
          <Edit sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem>
          <Delete sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết tồn kho</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Sản phẩm:</strong> {selectedItem.product_name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Biến thể:</strong> {selectedItem.variant_name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Tổng tồn kho:</strong> {selectedItem.quantity}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Đã đặt:</strong> {selectedItem.reserved}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Còn lại:</strong> {selectedItem.available}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Tối thiểu:</strong> {selectedItem.min_quantity}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Tối đa:</strong> {selectedItem.max_quantity}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Vị trí:</strong> {selectedItem.location}
              </Typography>
              <Typography variant="body1">
                <strong>Cập nhật:</strong> {new Date(selectedItem.last_updated).toLocaleString('vi-VN')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
