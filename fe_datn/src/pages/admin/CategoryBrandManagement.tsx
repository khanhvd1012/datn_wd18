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
  Tabs,
  Tab,
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
  Category,
  BrandingWatermark,
  Image,
} from '@mui/icons-material';
import api from '../../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  logo_image?: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

interface Brand {
  _id: string;
  name: string;
  description: string;
  logo_image?: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-brand-tabpanel-${index}`}
      aria-labelledby={`category-brand-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CategoryBrandManagement: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<Category | Brand | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_image: '',
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
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (tabValue === 0) {
        // Fetch categories from MongoDB
        const response = await api.get('/categories');
        setCategories(response.data);
      } else {
        // Fetch brands from MongoDB
        const response = await api.get('/brands');
        setBrands(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Không thể tải dữ liệu từ server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: Category | Brand) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleCreate = () => {
    setFormData({ name: '', description: '', logo_image: '' });
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEdit = (item: Category | Brand) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      logo_image: item.logo_image || '',
    });
    setDialogMode('edit');
    setOpenDialog(true);
    setAnchorEl(null); // Chỉ đóng menu, không xóa selectedItem
  };

  const handleSave = async () => {
    try {
      // Validate form data before sending
      if (!formData.name.trim()) {
        showNotification('Vui lòng nhập tên', 'error');
        return;
      }

      if (!formData.description.trim()) {
        showNotification('Vui lòng nhập mô tả', 'error');
        return;
      }

      if (formData.name.trim().length < 2) {
        showNotification('Tên phải có ít nhất 2 ký tự', 'error');
        return;
      }

      if (formData.name.trim().length > 50) {
        showNotification('Tên không được vượt quá 50 ký tự', 'error');
        return;
      }

      if (formData.description.trim().length > 500) {
        showNotification('Mô tả không được vượt quá 500 ký tự', 'error');
        return;
      }

      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        logo_image: formData.logo_image.trim() || '',
      };

      if (tabValue === 0) {
        // Category operations
        if (dialogMode === 'create') {
          await api.post('/categories', dataToSend);
          showNotification('Tạo danh mục thành công', 'success');
        } else if (dialogMode === 'edit' && selectedItem) {
          await api.put(`/categories/${selectedItem._id}`, dataToSend);
          showNotification('Cập nhật danh mục thành công', 'success');
        }
      } else {
        // Brand operations - logo_image is required for brands
        if (!formData.logo_image.trim()) {
          showNotification('Thương hiệu yêu cầu logo', 'error');
          return;
        }

        if (dialogMode === 'create') {
          await api.post('/brands', dataToSend);
          showNotification('Tạo thương hiệu thành công', 'success');
        } else if (dialogMode === 'edit' && selectedItem) {
          await api.put(`/brands/${selectedItem._id}`, dataToSend);
          showNotification('Cập nhật thương hiệu thành công', 'success');
        }
      }
      setOpenDialog(false);
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error saving item:', error);
      
      // Handle validation errors specifically
      if (error.response?.status === 400) {
        const errors = error.response?.data?.errors;
        if (Array.isArray(errors)) {
          const errorMessages = errors.map((err: any) => err.message).join(', ');
          showNotification(errorMessages, 'error');
          return;
        }
        
        const message = error.response?.data?.message || 'Dữ liệu không hợp lệ';
        showNotification(message, 'error');
        return;
      }
      
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        showNotification('Bạn cần đăng nhập để thực hiện thao tác này', 'error');
        return;
      }
      
      // Handle permission errors
      if (error.response?.status === 403) {
        showNotification('Bạn không có quyền thực hiện thao tác này', 'error');
        return;
      }
      
      const message = error.response?.data?.message || 'Không thể lưu dữ liệu';
      const detail = error.response?.data?.error ? ` (${error.response.data.error})` : '';
      showNotification(message + detail, 'error');
    }
  };

  const handleDelete = async (item: Category | Brand) => {
    setAnchorEl(null);
    try {
      if (tabValue === 0) {
        await api.delete(`/categories/${item._id}`);
        showNotification('Xóa danh mục thành công', 'success');
      } else {
        await api.delete(`/brands/${item._id}`);
        showNotification('Xóa thương hiệu thành công', 'success');
      }
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting item:', error);
      
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        showNotification('Bạn cần đăng nhập để thực hiện thao tác này', 'error');
        return;
      }
      
      // Handle permission errors
      if (error.response?.status === 403) {
        showNotification('Bạn không có quyền thực hiện thao tác này', 'error');
        return;
      }
      
      const message = error.response?.data?.message || 'Không thể xóa dữ liệu';
      const detail = error.response?.data?.error ? ` (${error.response.data.error})` : '';
      showNotification(message + detail, 'error');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    categories: {
      total: categories.length,
      active: categories.filter(c => c.isActive !== false).length,
      inactive: categories.filter(c => c.isActive === false).length,
    },
    brands: {
      total: brands.length,
      active: brands.filter(b => b.isActive !== false).length,
      inactive: brands.filter(b => b.isActive === false).length,
    },
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 'none' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Quản lý Danh mục & Thương hiệu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ borderRadius: 2 }}
        >
          Thêm {tabValue === 0 ? 'Danh mục' : 'Thương hiệu'}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)` }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {tabValue === 0 ? stats.categories.total : stats.brands.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng {tabValue === 0 ? 'danh mục' : 'thương hiệu'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200, background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)` }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {tabValue === 0 ? stats.categories.active : stats.brands.active}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang hoạt động
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200, background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)` }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {tabValue === 0 ? stats.categories.inactive : stats.brands.inactive}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Không hoạt động
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)` }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {tabValue === 0 ? stats.categories.total : stats.brands.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng số
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Danh mục" icon={<Category />} iconPosition="start" />
          <Tab label="Thương hiệu" icon={<BrandingWatermark />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder={`Tìm kiếm ${tabValue === 0 ? 'danh mục' : 'thương hiệu'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Categories Tab */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên danh mục</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: 'primary.main' }}>
                          <Category />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.isActive !== false ? 'Hoạt động' : 'Không hoạt động'}
                        color={category.isActive !== false ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, category)}
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
        </Paper>
      </TabPanel>

      {/* Brands Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên thương hiệu</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.2), color: 'secondary.main' }}>
                          <BrandingWatermark />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {brand.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {brand.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={brand.isActive !== false ? 'Hoạt động' : 'Không hoạt động'}
                        color={brand.isActive !== false ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(brand.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, brand)}
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
        </Paper>
      </TabPanel>

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
        <MenuItem onClick={() => selectedItem && handleEdit(selectedItem)}>
          <Edit sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => selectedItem && handleDelete(selectedItem)}>
          <Delete sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Thêm' : 'Chỉnh sửa'} {tabValue === 0 ? 'Danh mục' : 'Thương hiệu'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label={`Tên ${tabValue === 0 ? 'danh mục' : 'thương hiệu'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="URL Logo"
              value={formData.logo_image}
              onChange={(e) => setFormData({ ...formData, logo_image: e.target.value })}
              helperText="Để trống nếu không có logo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
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

export default CategoryBrandManagement;
