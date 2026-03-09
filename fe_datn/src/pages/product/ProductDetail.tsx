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
  sold?: number
}

const ProductDetail = () => {
  const [quantity, setQuantity] = useState<number>(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [bestSeller, setBestSeller] = useState<Product[]>([])

  const { id } = useParams()
  const navigate = useNavigate()

  // ================= LẤY SẢN PHẨM =================
  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
  }, [id])

  // ================= LẤY SẢN PHẨM BÁN CHẠY =================
  useEffect(() => {
    axios
      .get(
        'http://localhost:3000/products?_sort=sold&_order=desc&_limit=4'
      )
      .then((res) => setBestSeller(res.data))
      .catch((err) => console.error(err))
  }, [])

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

  const handleAddToCart = async () => {
    await addToCart()
    navigate('/cart')
  }

  const handleBuyNow = async () => {
    await addToCart()
    navigate('/checkout')
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
        <Link
          underline="hover"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
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

      {/* ================= SẢN PHẨM BÁN CHẠY ================= */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          🔥 Sản phẩm bán chạy
        </Typography>

        <Grid container spacing={3}>
          {bestSeller.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <Box
                  component="img"
                  src={item.img}
                  alt={item.name}
                  sx={{
                    width: '100%',
                    height: 160,
                    objectFit: 'contain',
                    mb: 2,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    height: 40,
                    overflow: 'hidden',
                    mb: 1,
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  sx={{
                    color: '#d70018',
                    fontWeight: 700,
                  }}
                >
                  {item.price.toLocaleString()}₫
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Container>
  )
}

export default ProductDetail