import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  IconButton,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/Star';
import { getAllReviewsApi, replyReviewApi, deleteReviewApi } from '../../services/reviewService';

interface ReviewItem {
  _id: string;
  user_id: {
    _id: string;
    username: string;
    fullName?: string;
    email: string;
    avatar?: string;
  };
  product_id: {
    _id: string;
    name: string;
    images?: string[];
  };
  rating: number;
  comment: string;
  admin_reply?: string;
  createdAt: string;
}

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getAllReviewsApi();
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá đánh giá này?')) return;
    try {
      await deleteReviewApi(id);
      showNotification('Xoá đánh giá thành công', 'success');
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Không thể xoá đánh giá', 'error');
    }
  };

  const openReplyDialog = (review: ReviewItem) => {
    setSelectedReview(review);
    setAdminReply(review.admin_reply || '');
    setReplyDialogOpen(true);
  };

  const handleReply = async () => {
    if (!selectedReview) return;
    setSubmitting(true);
    try {
      await replyReviewApi(selectedReview._id, adminReply);
      showNotification('Đã lưu phản hồi', 'success');
      setReplyDialogOpen(false);
      fetchReviews();
    } catch (err: any) {
      showNotification('Không thể phản hồi đánh giá', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Quản lý Đánh giá</Typography>
        <Button variant="contained" onClick={fetchReviews}>Làm mới</Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Người dùng</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Đánh giá</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nhận xét</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phản hồi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ngày</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={review.product_id?.images?.[0]}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="body2" fontWeight="medium">
                          {review.product_id?.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{review.user_id?.username}</Typography>
                      <Typography variant="caption" color="text.secondary">{review.user_id?.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Rating value={review.rating} size="small" readOnly />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {review.comment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {review.admin_reply ? (
                        <Chip size="small" label="Đã phản hồi" color="success" variant="outlined" />
                      ) : (
                        <Chip size="small" label="Chưa phản hồi" color="warning" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => openReplyDialog(review)}>
                        <ReplyIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(review._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {reviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      Chưa có đánh giá nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Phản hồi đánh giá</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Box p={2} sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="primary">Nhận xét của người dùng:</Typography>
                <Typography variant="body2">{selectedReview.comment}</Typography>
              </Box>
              <TextField
                label="Phản hồi của Admin"
                fullWidth
                multiline
                rows={4}
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Nhập nội dung phản hồi..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReplyDialogOpen(false)}>Đóng</Button>
          <Button 
            variant="contained" 
            onClick={handleReply} 
            disabled={submitting}
            sx={{ borderRadius: 2 }}
          >
            Lưu phản hồi
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReviews;
