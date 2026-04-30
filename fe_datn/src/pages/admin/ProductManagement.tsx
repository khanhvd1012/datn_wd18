import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, IconButton, TextField, InputAdornment, Chip, Avatar,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, useTheme, alpha
} from '@mui/material';

const Grid: React.FC<any> = (props) => <Box {...props} />;

import {
  Search, Add, Edit, Delete, FilterList, MoreVert,
  Visibility, ShoppingBag, TrendingUp, TrendingDown,
  Image, Inventory, Category, BrandingWatermark,
} from '@mui/icons-material';

import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
  original_price: number;
  description: string;
  category: string;
  brand: string;
  countInStock: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  original_price: number;
  category: string;
  brand: string;
  countInStock: number;
  images: string[];
  url: string;
}

const ProductManagement: React.FC = () => {
  const theme = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    original_price: 0,
    category: '',
    brand: '',
    countInStock: 0,
    images: [],
    url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = () => {
    setDialogMode('create');
    setFormData({
      name: '',
      description: '',
      price: 0,
      original_price: 0,
      category: '',
      brand: '',
      countInStock: 0,
      images: [],
      url: '',
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setDialogMode('edit');
    setSelectedProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      images: product.images || [],
      url: product.images?.[0] || '',
    });

    setOpenDialog(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm('Xóa sản phẩm?')) return;

    await axios.delete(`http://localhost:5000/api/products/${product._id}`);
    fetchProducts();
  };

  const handleSaveProduct = async () => {
    try {
      // 🔥 FIX QUAN TRỌNG NHẤT
      const finalUrl =
        formData.url?.trim() ||
        formData.images?.[0]?.trim() ||
        "https://via.placeholder.com/300";

      const payload = {
        ...formData,
        url: finalUrl,
      };

      console.log("SEND:", payload);

      if (dialogMode === 'create') {
        await axios.post('http://localhost:5000/api/products', payload);
      } else {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProduct?._id}`,
          payload
        );
      }

      setOpenDialog(false);
      fetchProducts();

    } catch (error) {
      console.error(error);
      alert("Lỗi: thiếu URL hoặc dữ liệu sai");
    }
  };

  return (
    <Box p={3}>
      <Button variant="contained" startIcon={<Add />} onClick={handleCreateProduct}>
        Thêm sản phẩm
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.countInStock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditProduct(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduct(p)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth label="Tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth label="URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth label="Images"
            value={formData.images.join(',')}
            onChange={(e) =>
              setFormData({
                ...formData,
                images: e.target.value.split(',').map(i => i.trim())
              })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;