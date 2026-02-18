import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface CartItem {
  id: number
  productId: number
  name: string
  img: string
  price: number
  quantity: number
}

const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const navigate = useNavigate()

  // ================= LOAD CART =================
  useEffect(() => {
    axios
      .get('http://localhost:3000/cart')
      .then((res) => setCart(res.data))
      .catch((err) => console.error(err))
  }, [])

  // ================= TOTAL =================
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      // xoá toàn bộ cart
      await Promise.all(
        cart.map((item) =>
          axios.delete(`http://localhost:3000/cart/${item.id}`)
        )
      )

      alert('Đặt hàng thành công 🎉')
      navigate('/')
    } catch (error) {
      console.error('Lỗi đặt hàng:', error)
    }
  }

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">
          Không có sản phẩm để thanh toán
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Thanh Toán
      </Typography>

      {/* DANH SÁCH SẢN PHẨM */}
      {cart.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography>
            {item.name} x {item.quantity}
          </Typography>
          <Typography>
            {(item.price * item.quantity).toLocaleString()}₫
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 3 }}>
        Tổng tiền: {totalPrice.toLocaleString()}₫
      </Typography>

      {/* FORM THÔNG TIN */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          label="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
        />

        <TextField
          label="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#d32f2f',
            '&:hover': { backgroundColor: '#b71c1c' },
          }}
          onClick={handlePlaceOrder}
        >
          Đặt hàng
        </Button>
      </Box>
    </Container>
  )
}

export default Checkout
