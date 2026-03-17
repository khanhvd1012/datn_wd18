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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Add,
  Article,
  Schedule,
  Visibility as EyeIcon,
  Share,
} from '@mui/icons-material';
import api from '../../services/api';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  images?: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  views: number;
  shares: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const NewsManagement: React.FC = () => {
  const theme = useTheme();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    images: [] as File[],
    existingImages: [] as string[],
    status: 'published' as 'draft' | 'published' | 'archived',
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
    fetchNewsItems();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const fetchNewsItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', (page + 1).toString());
      params.append('limit', rowsPerPage.toString());

      // Fetch news from MongoDB
      const response = await api.get(`/news?${params.toString()}`);
      
      // Handle paginated response or direct array
      const newsData = response.data.data || response.data;
      setNewsItems(Array.isArray(newsData) ? newsData : []);
    } catch (error: any) {
      console.error('Error fetching news:', error);
      const message = error.response?.data?.message || 'Không thể tải dữ liệu tin tức';
      showNotification(message, 'error');
      setNewsItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, news: NewsItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedNews(news);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewNews = (news: NewsItem) => {
    setSelectedNews(news);
    setOpenDetailDialog(true);
    handleMenuClose();
  };

  const openCreateNewsDialog = () => {
    setNewsForm({ title: '', content: '', images: [], existingImages: [], status: 'published' });
    setOpenCreateDialog(true);
  };

  const handleEditNews = (news: NewsItem) => {
    setSelectedNews(news);
    setNewsForm({
      title: news.title,
      content: news.content,
      images: [],
      existingImages: news.images || [],
      status: news.status || 'published'
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleCreateNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      showNotification('Tiêu đề và nội dung không được để trống', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newsForm.title);
      formData.append('content', newsForm.content);
      formData.append('status', newsForm.status);
      newsForm.images.forEach((file) => formData.append('images', file));

      console.log('Create news payload', {
        title: newsForm.title,
        content: newsForm.content,
        status: newsForm.status,
        images: newsForm.images.map((f) => f.name),
      });

      const response = await api.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Create news response', response.data);
      showNotification('Tạo bài viết thành công', 'success');
      setOpenCreateDialog(false);
      setNewsForm({ title: '', content: '', images: [], existingImages: [], status: 'published' });
      fetchNewsItems();
    } catch (error: any) {
      console.error('Error creating news:', error);
      let message = 'Không thể tạo bài viết';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.map((e: any) => e.message).join(' | ');
      }
      showNotification(message, 'error');
    }
  };

  const handleUpdateNews = async () => {
    if (!selectedNews) {
      showNotification('Không có bài viết để cập nhật', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newsForm.title);
      formData.append('content', newsForm.content);
      formData.append('status', newsForm.status);
      newsForm.existingImages.forEach((url) => formData.append('existingImages', url));
      newsForm.images.forEach((file) => formData.append('images', file));

      const response = await api.put(`/news/${selectedNews._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Updated news response', response.data);
      showNotification('Cập nhật bài viết thành công', 'success');
      setOpenEditDialog(false);
      setSelectedNews(null);
      fetchNewsItems();
    } catch (error: any) {
      console.error('Error updating news:', error);
      let message = 'Không thể cập nhật bài viết';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.map((e: any) => e.message).join(' | ');
      }
      showNotification(message, 'error');
    }
  };

  const handleDeleteNews = async (news: NewsItem) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await api.delete(`/news/${news._id}`);
      showNotification('Xóa bài viết thành công', 'success');
      fetchNewsItems();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      showNotification(error.response?.data?.message || 'Không thể xóa bài viết', 'error');
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
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã đăng';
      case 'draft':
        return 'Bản nháp';
      case 'archived':
        return 'Lưu trữ';
      default:
        return status;
    }
  };

  const newsStats = {
    total: newsItems.length,
    published: newsItems.filter(item => item.status === 'published').length,
    draft: newsItems.filter(item => item.status === 'draft').length,
    totalViews: newsItems.reduce((sum, item) => sum + item.views, 0),
  };

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || news.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Quản lý tin tức
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
          onClick={openCreateNewsDialog}
        >
          Viết bài mới
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
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {newsStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng bài viết
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
              {newsStats.published}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã đăng
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
              {newsStats.draft}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bản nháp
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
              {newsStats.totalViews.toLocaleString('vi-VN')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng lượt xem
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm bài viết..."
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
              <MenuItem value="published">Đã đăng</MenuItem>
              <MenuItem value="draft">Bản nháp</MenuItem>
              <MenuItem value="archived">Lưu trữ</MenuItem>
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

      {/* News Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Lượt xem</TableCell>
                <TableCell>Chia sẻ</TableCell>
                <TableCell>Ngày đăng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNews.map((news) => (
                <TableRow key={news._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {news.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {news.excerpt}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {news.author}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(news.status)}
                      color={getStatusColor(news.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EyeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {news.views.toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Share fontSize="small" color="action" />
                      <Typography variant="body2">
                        {news.shares}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN') : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, news)}
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
          count={filteredNews.length}
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
        <MenuItem onClick={() => selectedNews && handleViewNews(selectedNews)}>
          <Visibility sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => selectedNews && handleEditNews(selectedNews)}>
          <Edit sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={() => selectedNews && handleDeleteNews(selectedNews)}>
          <Delete sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết bài viết</DialogTitle>
        <DialogContent>
          {selectedNews && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedNews.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={getStatusText(selectedNews.status)} color={getStatusColor(selectedNews.status)} />
                <Chip label={`Tác giả: ${selectedNews.author}`} variant="outlined" />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNews.content}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Lượt xem:</strong> {selectedNews.views.toLocaleString('vi-VN')}
                </Typography>
                <Typography variant="body2">
                  <strong>Chia sẻ:</strong> {selectedNews.shares}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Tags:</strong> {selectedNews.tags.join(', ')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Viết bài mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Tiêu đề" fullWidth value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} />
            <TextField label="Nội dung" fullWidth multiline minRows={4} value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newsForm.status}
                label="Trạng thái"
                onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as 'draft' | 'published' | 'archived' })}
              >
                <MenuItem value="published">Đã đăng</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="archived">Lưu trữ</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Button variant="contained" component="label" htmlFor="news-create-images">Chọn ảnh</Button>
              <input
                id="news-create-images"
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  console.log('Selected create news files', files);
                  setNewsForm({ ...newsForm, images: files });
                }}
              />
            </Box>
            <Typography variant="body2">Ảnh đã chọn: {newsForm.images.length}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
          <Button onClick={handleCreateNews} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Tiêu đề" fullWidth value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} />
            <TextField label="Nội dung" fullWidth multiline minRows={4} value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newsForm.status}
                label="Trạng thái"
                onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as 'draft' | 'published' | 'archived' })}
              >
                <MenuItem value="published">Đã đăng</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="archived">Lưu trữ</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="body2">Ảnh hiện có: {newsForm.existingImages.length}</Typography>
              {newsForm.existingImages.map((img, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src={img} width={80} />
                  <Button size="small" onClick={() => setNewsForm({...newsForm, existingImages: newsForm.existingImages.filter((u) => u !== img)})}>Xóa</Button>
                </Box>
              ))}
            </Box>
            <Box>
              <Button variant="contained" component="label" htmlFor="news-edit-images">Thêm ảnh mới</Button>
              <input
                id="news-edit-images"
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  console.log('Selected edit news files', files);
                  setNewsForm({ ...newsForm, images: [...newsForm.images, ...files] });
                }}
              />
            </Box>
            <Typography variant="body2">Ảnh mới: {newsForm.images.length}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdateNews} variant="contained">Lưu</Button>
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

export default NewsManagement;
