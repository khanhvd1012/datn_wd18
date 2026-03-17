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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllContactsApi, deleteContactApi } from '../../services/contactService';

interface ContactItem {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  createdAt: string;
}

const AdminFeedback: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getAllContactsApi();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải phản hồi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá phản hồi này?')) return;
    try {
      await deleteContactApi(id);
      showNotification('Xoá phản hồi thành công', 'success');
      fetchContacts();
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Không thể xoá phản hồi', 'error');
    }
  };

  const openDetail = (contact: ContactItem) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Quản lý phản hồi</Typography>
        <Button variant="contained" onClick={fetchContacts}>Làm mới</Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Người gửi</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Ngày gửi</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.username}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.address}</TableCell>
                    <TableCell>{new Date(contact.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => openDetail(contact)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(contact._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Chi tiết phản hồi</DialogTitle>
        <DialogContent>
          {selectedContact ? (
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField label="Người gửi" fullWidth value={selectedContact.username} InputProps={{ readOnly: true }} />
              <TextField label="Email" fullWidth value={selectedContact.email} InputProps={{ readOnly: true }} />
              <TextField label="Số điện thoại" fullWidth value={selectedContact.phone} InputProps={{ readOnly: true }} />
              <TextField label="Địa chỉ" fullWidth value={selectedContact.address} InputProps={{ readOnly: true }} />
              <TextField label="Nội dung" fullWidth multiline minRows={4} value={selectedContact.message} InputProps={{ readOnly: true }} />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminFeedback;
