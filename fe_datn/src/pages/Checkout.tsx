import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

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
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('http://localhost:3000/cart')
      .then((res) => setCart(res.data))
  }, [])

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const shippingFee = subTotal > 500000 ? 0 : 30000
  const discount = subTotal > 1000000 ? subTotal * 0.1 : 0
  const total = subTotal + shippingFee - discount

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    await axios.patch(`http://localhost:3000/cart/${id}`, {
      quantity: newQuantity,
    })

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = async (id: number) => {
    await axios.delete(`http://localhost:3000/cart/${id}`)
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const isValidPhone = (phone: string) =>
    /^(0[3|5|7|8|9])[0-9]{8}$/.test(phone)

  const isFormValid =
    name.trim().length >= 2 &&
    isValidPhone(phone) &&
    address.trim().length >= 10

  const handlePlaceOrder = async () => {
    if (!isFormValid) return alert('Vui lòng nhập đúng thông tin')

    try {
      setLoading(true)

      await axios.post('http://localhost:3000/orders', {
        customerName: name,
        phone,
        address,
        paymentMethod,
        items: cart,
        subTotal,
        shippingFee,
        discount,
        total,
        createdAt: new Date(),
      })

      await Promise.all(
        cart.map((item) =>
          axios.delete(`http://localhost:3000/cart/${item.id}`)
        )
      )

      setCart([])
      setOpenSnackbar(true)

      setTimeout(() => navigate('/'), 1500)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <>
        <Container sx={{ py: 10 }}>
          <Typography variant="h5" textAlign="center">
            Giỏ hàng của bạn đang trống
          </Typography>
        </Container>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Box sx={{ background: '#f5f5f7', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              mb: 6,
              fontWeight: 700,
              textAlign: 'center',
              color: '#222',
            }}
          >
            Thanh Toán
          </Typography>

          <Grid container spacing={4}>
            {/* CART */}
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  {cart.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 3,
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar
                          src={item.img}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />

                        <Box>
                          <Typography fontWeight={600}>
                            {item.name}
                          </Typography>

                          <Typography
                            sx={{ color: '#d70018', fontWeight: 600 }}
                          >
                            {item.price.toLocaleString()}₫
                          </Typography>

                          <Box sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>

                            {item.quantity}

                            <Button
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        Xóa
                      </Button>
                    </Box>
                  ))}

                  <Divider sx={{ my: 3 }} />

                  <Box display="flex" justifyContent="space-between">
                    <Typography>Tạm tính</Typography>
                    <Typography>{subTotal.toLocaleString()}₫</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography>Phí vận chuyển</Typography>
                    <Typography>
                      {shippingFee === 0
                        ? 'Miễn phí'
                        : shippingFee.toLocaleString() + '₫'}
                    </Typography>
                  </Box>

                  {discount > 0 && (
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Typography>Giảm giá</Typography>
                      <Typography color="success.main">
                        -{discount.toLocaleString()}₫
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Tổng</Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: '#d70018', fontWeight: 700 }}
                    >
                      {total.toLocaleString()}₫
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* FORM */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
                <Typography variant="h6" mb={3} fontWeight={600}>
                  Thông tin giao hàng
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
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

                  <Typography fontWeight={600}>
                    Phương thức thanh toán
                  </Typography>

                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="cod"
                      control={<Radio sx={{ color: '#d70018' }} />}
                      label="Thanh toán khi nhận hàng (COD)"
                    />
                    <FormControlLabel
                      value="bank"
                      control={<Radio sx={{ color: '#d70018' }} />}
                      label="Chuyển khoản ngân hàng"
                    />
                  </RadioGroup>

                  <Button
                    variant="contained"
                    size="large"
                    disabled={!isFormValid || loading}
                    onClick={handlePlaceOrder}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      backgroundColor: '#d70018',
                      '&:hover': { backgroundColor: '#b80014' },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Đặt hàng ngay'
                    )}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          Thanh toán thành công 🎉
        </Alert>
      </Snackbar>
    </>
  )
}

export default Checkout