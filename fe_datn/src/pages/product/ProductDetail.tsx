import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Breadcrumbs,
  Link,
} from '@mui/material'
import { ShoppingCart } from 'lucide-react'
import Footer from '../../components/Footer'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)

  const { id } = useParams()

  useEffect(() => {
    axios
      .get('http://localhost:3000/products')
      .then((res) => {
        const foundProduct = res.data.find(
          (item) => String(item.id) === String(id)
        )
        setProduct(foundProduct)
      })
      .catch((err) => {
        console.error('Lỗi lấy sản phẩm:', err)
      })
  }, [id])

  // 🔥 Thêm vào giỏ hàng (KHÔNG thông báo)
  const handleAddToCart = () => {
    if (!product) return

    const storedCart = localStorage.getItem('cart')
    const cart = storedCart ? JSON.parse(storedCart) : []

    const existingIndex = cart.findIndex(
      (item) => String(item.id) === String(product.id)
    )

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({
        ...product,
        quantity: quantity,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
  }

  if (!product) {
    return (
      <Container>
        <Typography>Không tìm thấy sản phẩm</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Breadcrumbs sx={{ mb: 1, px: 1, py: 1, borderRadius: 2, fontSize: 18 }}>
        <Link
          href="/"
          underline="hover"
          sx={{
            fontWeight: 600,
            color: '#e5d76f',
            '&:hover': { color: '#f87e7e' },
          }}
        >
          Trang chủ
        </Link>

        <Typography
          sx={{
            fontWeight: 600,
            color: '#717171',
          }}
        >
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <img
              src={product.img}
              alt={product.name}
              style={{
                width: '400px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            {product.name}
          </Typography>

          <Typography
            variant="h5"
            sx={{ color: '#ff0000', mb: 2, fontWeight: 'bold' }}
          >
            {product.price?.toLocaleString()}₫
          </Typography>

          <TextField
            type="number"
            label="Số lượng"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
            inputProps={{ min: 1 }}
            sx={{
              width: 110,
              mb: 3,
              '& input': {
                color: '#fff',
                textAlign: 'center',
              },
              '& .MuiInputLabel-root': {
                color: '#fff',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#fff',
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ff6b35', flex: 1 }}
              startIcon={<ShoppingCart size={20} />}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: '#d32f2f', flex: 1 }}
            >
              Mua ngay
            </Button>
          </Box>

          <Typography sx={{ mt: 3 }}>
            <strong>Mô tả:</strong> {product.description}
          </Typography>
        </Grid>
      </Grid>

      <Footer />
    </Container>
  )
}

export default ProductDetail
