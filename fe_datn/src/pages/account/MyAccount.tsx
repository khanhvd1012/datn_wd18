import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  TextField,
  Card,
  CardContent
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyAccount = () => {

  const navigate = useNavigate()

  const [user,setUser] = useState(null)
  const [orders,setOrders] = useState([])
  const [tab,setTab] = useState("profile")

  useEffect(()=>{

    const u = JSON.parse(localStorage.getItem("user") || "null")

    if(!u){
      navigate("/login")
      return
    }

    setUser(u)

    axios
      .get(`http://localhost:3000/orders?customerName=${u.name}`)
      .then(res=>setOrders(res.data))

  },[])

  const logout = ()=>{
    localStorage.removeItem("user")
    navigate("/login")
  }

  if(!user) return null

  return(

  <Box sx={{background:"#f6f8fb",minHeight:"100vh",py:6}}>

  <Container maxWidth="lg">

  <Grid container spacing={4}>

  {/* SIDEBAR */}

  <Grid item xs={12} md={3}>

  <Paper
  elevation={3}
  sx={{p:3,borderRadius:3}}
  >

  <Box textAlign="center">

  <Avatar
  src={user.avatar || "https://i.pravatar.cc/150"}
  sx={{
  width:90,
  height:90,
  mx:"auto",
  mb:1
  }}
  />

  <Typography fontWeight="bold" fontSize={18}>
  {user.name}
  </Typography>

  <Typography fontSize={13} color="gray">
  {user.email}
  </Typography>

  </Box>

  <Divider sx={{my:2}}/>

  <Button
  fullWidth
  sx={{
  justifyContent:"flex-start",
  mb:1
  }}
  onClick={()=>setTab("profile")}
  >
  Thông tin cá nhân
  </Button>

  <Button
  fullWidth
  sx={{
  justifyContent:"flex-start",
  mb:1
  }}
  onClick={()=>setTab("orders")}
  >
  Đơn hàng của tôi
  </Button>

  <Button
  fullWidth
  sx={{
  justifyContent:"flex-start",
  mb:1
  }}
  onClick={()=>setTab("password")}
  >
  Đổi mật khẩu
  </Button>

  <Divider sx={{my:2}}/>

  <Button
  fullWidth
  color="error"
  variant="outlined"
  onClick={logout}
  >
  Đăng xuất
  </Button>

  </Paper>

  </Grid>

  {/* CONTENT */}

  <Grid item xs={12} md={9}>

  <Paper
  elevation={3}
  sx={{
  p:4,
  borderRadius:3
  }}
  >

  {/* PROFILE */}

  {tab === "profile" && (

  <Box>

  <Typography
  variant="h6"
  fontWeight="bold"
  mb={3}
  >
  Thông tin cá nhân
  </Typography>

  <Grid container spacing={3}>

  <Grid item xs={12} md={6}>
  <TextField
  fullWidth
  label="Họ tên"
  value={user.name}
  />
  </Grid>

  <Grid item xs={12} md={6}>
  <TextField
  fullWidth
  label="Email"
  value={user.email}
  />
  </Grid>

  <Grid item xs={12} md={6}>
  <TextField
  fullWidth
  label="Số điện thoại"
  value={user.phone || ""}
  />
  </Grid>

  </Grid>

  <Button
  variant="contained"
  sx={{mt:3}}
  >
  Cập nhật
  </Button>

  </Box>

  )}

  {/* ORDERS */}

  {tab === "orders" && (

  <Box>

  <Typography
  variant="h6"
  fontWeight="bold"
  mb={3}
  >
  Đơn hàng của tôi
  </Typography>

  {orders.length === 0 && (
  <Typography color="gray">
  Chưa có đơn hàng
  </Typography>
  )}

  {orders.map(order=>(

  <Card
  key={order.id}
  sx={{
  mb:2,
  borderRadius:3,
  transition:"0.3s",
  "&:hover":{
  transform:"translateY(-3px)",
  boxShadow:4
  }
  }}
  >

  <CardContent>

  <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  >

  <Typography fontWeight="bold">
  Đơn hàng #{order.id}
  </Typography>

  <Typography color="gray" fontSize={13}>
  {new Date(order.createdAt).toLocaleDateString()}
  </Typography>

  </Box>

  <Typography mt={1}>
  Tổng tiền: <b>{order.total?.toLocaleString()}₫</b>
  </Typography>

  </CardContent>

  </Card>

  ))}

  </Box>

  )}

  {/* PASSWORD */}

  {tab === "password" && (

  <Box>

  <Typography
  variant="h6"
  fontWeight="bold"
  mb={3}
  >
  Đổi mật khẩu
  </Typography>

  <TextField
  fullWidth
  label="Mật khẩu cũ"
  type="password"
  sx={{mb:2}}
  />

  <TextField
  fullWidth
  label="Mật khẩu mới"
  type="password"
  sx={{mb:2}}
  />

  <TextField
  fullWidth
  label="Nhập lại mật khẩu"
  type="password"
  />

  <Button
  variant="contained"
  sx={{mt:3}}
  >
  Đổi mật khẩu
  </Button>

  </Box>

  )}

  </Paper>

  </Grid>

  </Grid>

  </Container>

  </Box>

  )

}

export default MyAccount