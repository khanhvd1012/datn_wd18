import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllUsersApi, updateUserRoleApi, deleteUserApi } from "../../services/userService";
import { ROLES } from "../../config/roles";

const roleOptions = [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.USER, ROLES.CUSTOMER];

const Users = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersApi();
      setUsers(data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRoleApi(id, role);
      showNotification("Cập nhật vai trò thành công", "success");
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.message || "Cập nhật vai trò thất bại", "error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await deleteUserApi(id);
      showNotification("Xoá người dùng thành công", "success");
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.message || "Xoá người dùng thất bại", "error");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={2}>Quản lý người dùng</Typography>
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" py={4}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.role === ROLES.ADMIN ? (
                        <Chip label="isAdmin" color="primary" size="small" />
                      ) : user.role === ROLES.EMPLOYEE ? (
                        <Chip label="employee" color="success" size="small" />
                      ) : user.role === ROLES.CUSTOMER ? (
                        <Chip label="customer" color="warning" size="small" />
                      ) : (
                        <Chip label="user" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={user.role || ROLES.USER}
                          label="Role"
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          {roleOptions.map((r) => (
                            <MenuItem key={r} value={r}>{r}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        disabled={currentUser?._id === user._id}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity} sx={{ width: '100%' }}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
