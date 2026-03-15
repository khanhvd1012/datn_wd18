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
  CircularProgress
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  getAllBannersApi,
  createBannerApi,
  deleteBannerApi
} from "../../services/bannerService";

interface Banner {
  _id: string;
  title: string;
  image: string;
}

const AdminBanner: React.FC = () => {

  const [banners, setBanners] = useState<Banner[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

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

  /* ================= CREATE BANNER ================= */

  const handleCreate = async () => {

    if (!title || !image) {

      alert("Vui lòng nhập đầy đủ thông tin");

      return;

    }

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("image", image);

      await createBannerApi(formData);

      setOpen(false);

      setTitle("");
      setImage(null);
      setPreview("");

      fetchData();

    } catch (error) {

      console.log(error);

    }

  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {

    const confirmDelete = window.confirm("Bạn có chắc muốn xoá banner?");

    if (!confirmDelete) return;

    try {

      await deleteBannerApi(id);

      fetchData();

    } catch (error) {

      console.log(error);

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
          onClick={() => setOpen(true)}
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
              <TableCell width={120}>Action</TableCell>

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

                <TableCell>

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

          Add Banner

        </DialogTitle>

        <DialogContent>

          <TextField
            label="Title"
            fullWidth
            sx={{ mt: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            style={{ marginTop: 20 }}
            onChange={handleImageChange}
          />

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
            onClick={handleCreate}
          >

            Save

          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

};

export default AdminBanner;