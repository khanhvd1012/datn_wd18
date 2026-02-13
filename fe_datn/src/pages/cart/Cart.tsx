import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material'
import { Plus, Minus, Trash2 } from 'lucide-react'

const Cart = () => {
  const [cart, setCart] = useState([])

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:3000/cart')
      setCart(res.data)
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return

    try {
      await axios.patch(`http://localhost:3000/cart/${id}`, {
        quantity: newQuantity,
      })
      fetchCart()
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error)
    }
  }

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`)
      fetchCart()
    } catch (error) {
      console.error('Lỗi xoá sản phẩm:', error)
    }
  }

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  )

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Giỏ hàng
      </Typography>

      {cart.length === 0 ? (
        <Typography>Giỏ hàng trống</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                borderBottom: '1px solid #ccc',
                pb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                  src={item.img}
                  alt={item.name}
                  width={80}
                  height={80}
                />
                <Box>
                  <Typography>{item.name}</Typography>
                  <Typography color="error">
                    {Number(item.price).toLocaleString()}₫
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  <Minus size={16} />
                </IconButton>

                <Typography>{item.quantity}</Typography>

                <IconButton
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  <Plus size={16} />
                </IconButton>
              </Box>

              <IconButton onClick={() => removeItem(item.id)}>
                <Trash2 color="red" />
              </IconButton>
            </Box>
          ))}

          <Typography variant="h6" sx={{ mt: 3 }}>
            Tổng tiền: {totalPrice.toLocaleString()}₫
          </Typography>

          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Thanh toán
          </Button>
        </>
      )}
    </Container>
  )
}

export default Cart
