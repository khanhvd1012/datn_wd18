import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { createProductApi, deleteProductApi, getAllProductsApi, updateProductApi } from "../../services/productService";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const loadData = async () => {
    try {
      const data = await getAllProductsApi();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", price: "", category: "", description: "" });
    setSelectedImage(null);
    setOpen(true);
  };

  const openEdit = (prod: any) => {
    setEditing(prod);
    setForm({ name: prod.name || "", price: prod.price || "", category: prod.category || "", description: prod.description || "" });
    setSelectedImage(null);
    setOpen(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price.toString());
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("slug", form.name.toLowerCase().replace(/\s+/g, "-") + Date.now());
    if (selectedImage) formData.append("images", selectedImage);

    try {
      if (editing) {
        await updateProductApi(editing._id, formData);
      } else {
        await createProductApi(formData);
      }
      setOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Lưu không thành công");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    await deleteProductApi(id);
    loadData();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button variant="contained" color="primary" onClick={openNew}>Thêm sản phẩm</Button>
      </Box>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id || product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price ?? "-"}</TableCell>
                  <TableCell>
                    {typeof product.category === "string"
                      ? product.category
                      : product.category?.name || "-"}
                  </TableCell>
                  <TableCell>{String(product.description ?? "-").slice(0, 80)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => openEdit(product)}>Sửa</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(product._id || product.id)}>Xóa</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Giá" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth />
            <TextField label="Danh mục" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />
            <TextField label="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
            <input type="file" onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;
