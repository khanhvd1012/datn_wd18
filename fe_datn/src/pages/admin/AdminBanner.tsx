import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Switch,
  Snackbar,
  Alert,
  Tooltip
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import {
  getAllBannersApi,
  createBannerApi,
  deleteBannerApi,
  updateBannerApi,
  toggleBannerStatusApi
} from "../../services/bannerService";

interface Banner {
  _id: string;
  title: string;
  image: string;
  status: any;
}

const AdminBanner: React.FC = () => {

  const [banners, setBanners] = useState<Banner[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState(true);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD BANNERS ================= */

  const fetchData = async () => {

    try {

      setLoading(true);

      const data = await getAllBannersApi();

      setBanners(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  /* ================= CREATE / UPDATE BANNER ================= */

  const handleSave = async () => {

    if (!title) {

      alert("Vui lòng nhập tiêu đề");

      return;

    }

    if (!editingId && !image) {

      alert("Vui lòng chọn ảnh banner");

      return;

    }

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("status", status ? "active" : "inactive");
      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await updateBannerApi(editingId, formData);
        showNotification("Cập nhật banner thành công", "success");
      } else {
        await createBannerApi(formData);
        showNotification("Thêm banner thành công", "success");
      }

      setOpen(false);

      setTitle("");
      setImage(null);
      setPreview("");
      setEditingId(null);
      setStatus(true);

      fetchData();

    } catch (error: any) {

      if (error.response?.data?.message) {
        showNotification(error.response.data.message, "error");
      } else if (error.response?.data?.errors) {
        showNotification(error.response.data.errors[0].message, "error");
      } else {
        console.log(error);
        showNotification("Có lỗi xảy ra", "error");
      }

    }

  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  /* ================= EDIT BANNER ================= */
  const handleEditClick = (banner: any) => {
    setEditingId(banner._id);
    setTitle(banner.title);
    setPreview(banner.image);
    setStatus(banner.status === true || banner.status === 'active');
    setImage(null);
    setOpen(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {

    const confirmDelete = window.confirm("Bạn có chắc muốn xoá banner?");

    if (!confirmDelete) return;

    try {

      await deleteBannerApi(id);
      showNotification("Xoá banner thành công", "success");
      fetchData();

    } catch (error) {

      console.log(error);
      showNotification("Lỗi khi xoá banner", "error");

    }


  };


  /* ================= TOGGLE STATUS ================= */

  const handleToggleStatus = async (id: string) => {

    try {

      await toggleBannerStatusApi(id);
      fetchData();

    } catch (error) {

      console.log(error);
      showNotification("Lỗi khi đổi trạng thái", "error");

    }

  };

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files) return;

    const file = e.target.files[0];

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

  };

  return (

    <Box p={4}>

      {/* HEADER */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >

        <Typography variant="h4" fontWeight="bold">
          Banner Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingId(null);
            setTitle("");
            setPreview("");
            setImage(null);
            setOpen(true);
          }}
        >
          Add Banner
        </Button>

      </Box>

      {/* TABLE */}

      {loading ? (

        <CircularProgress />

      ) : (

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right" width={150}>Action</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {banners.map((item) => (

              <TableRow key={item._id}>

                <TableCell>

                  <img
                    src={item.image}
                    alt={item.title}
                    width={140}
                    style={{ borderRadius: 8 }}
                  />

                </TableCell>

                <TableCell>

                  {item.title}

                </TableCell>

                <TableCell align="center">

                  <Tooltip title={item.status ? "Đang hiển thị" : "Đang ẩn"}>
                    <Switch
                      checked={item.status}
                      onChange={() => handleToggleStatus(item._id)}
                      color="success"
                    />
                  </Tooltip>

                </TableCell>

                <TableCell align="right">

                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(item)}
                  >

                    <EditIcon />

                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item._id)}
                  >

                    <DeleteIcon />

                  </IconButton>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      )}

      {/* ADD BANNER */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >

        <DialogTitle>

          {editingId ? "Edit Banner" : "Add Banner"}

        </DialogTitle>

        <DialogContent>

          <TextField
            label="Title"
            fullWidth
            sx={{ mt: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Box mt={3} display="flex" alignItems="center" gap={1}>
            <Typography>Status:</Typography>
            <Switch
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              color="success"
            />
            <Typography variant="body2" color="textSecondary">
              {status ? "Hiển thị" : "Ẩn"}
            </Typography>
          </Box>

          <Box mt={3}>
            <Typography variant="body2" mb={1}>Banner Image:</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Box>

          {/* PREVIEW */}

          {preview && (

            <Box mt={2}>

              <img
                src={preview}
                alt="preview"
                width="100%"
                style={{ borderRadius: 10 }}
              />

            </Box>

          )}

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpen(false)}>

            Cancel

          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >

            Save

          </Button>

        </DialogActions>

      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

    </Box>

  );

};

export default AdminBanner;