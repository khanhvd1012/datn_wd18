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
import { useParams, useNavigate } from 'react-router-dom'

interface Product {
  id: number
  name: string
  img: string
  price: number
  description: string
}

const ProductDetail = () => {
  const [quantity, setQuantity] = useState<number>(1)
  const [product, setProduct] = useState<Product | null>(null)

  const { id } = useParams()
  const navigate = useNavigate()

  // ================= LẤY SẢN PHẨM =================
  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
  }, [id])

  // ================= THÊM VÀO CART =================
  const addToCart = async () => {
    if (!product) return

    try {
      const res = await axios.get(
        `http://localhost:3000/cart?productId=${product.id}`
      )

      if (res.data.length > 0) {
        const existing = res.data[0]

        await axios.patch(
          `http://localhost:3000/cart/${existing.id}`,
          {
            quantity: existing.quantity + quantity,
          }
        )
      } else {
        await axios.post('http://localhost:3000/cart', {
          productId: product.id,
          name: product.name,
          img: product.img,
          price: product.price,
          quantity,
        })
      }
    } catch (error) {
      console.error('Lỗi thêm giỏ hàng:', error)
    }
  }

  // ================= BUTTON HANDLERS =================
  const handleAddToCart = async () => {
    await addToCart()
    navigate('/cart') // 👉 chuyển sang giỏ hàng
  }

  const handleBuyNow = async () => {
    await addToCart()
    navigate('/checkout') // 👉 chuyển sang trang thanh toán
  }

  if (!product) {
    return (
      <Container>
        <Typography>Không tìm thấy sản phẩm</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" underline="hover">
          Trang chủ
        </Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {product.name}
          </Typography>

          <Typography
            variant="h5"
            sx={{ color: '#ff0000', mb: 2 }}
          >
            {product.price.toLocaleString()}₫
          </Typography>

          <TextField
            type="number"
            label="Số lượng"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
            inputProps={{ min: 1 }}
            sx={{ width: 120, mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                flex: 1,
                backgroundColor: '#ff6b35',
                '&:hover': { backgroundColor: '#e65c2f' },
              }}
              startIcon={<ShoppingCart size={20} />}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </Button>

            <Button
              variant="contained"
              sx={{
                flex: 1,
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
              }}
              onClick={handleBuyNow}
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
