import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  TextField,
  Card,
  CardContent,
  Snackbar,
  Alert
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
}

const MyAccount = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState("profile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [oldPass,setOldPass] = useState("")
  const [newPass,setNewPass] = useState("")
  const [confirmPass,setConfirmPass] = useState("")

  const [open,setOpen] = useState(false)

  useEffect(()=>{

    const userRaw = localStorage.getItem("user");
    const u = userRaw ? (JSON.parse(userRaw) as User) : null;

    if (!u) {
      navigate("/login");
      return;
    }

    setUser(u);
    setName(u.name);
    setPhone(u.phone || "");

    axios
      .get(`http://localhost:3000/orders?customerName=${u.name}`)
      .then(res=>setOrders(res.data))

  },[])

  const logout = ()=>{
    localStorage.removeItem("user")
    navigate("/login")
  }

  const updateProfile = async()=>{

    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      name,
      phone,
    };

    await axios.patch(
      `http://localhost:3000/users/${user.id}`,
      updatedUser
    );

    localStorage.setItem("user",JSON.stringify(updatedUser))

    setUser(updatedUser)
    setOpen(true)

  }

  const changePassword = async()=>{

    if (!user) {
      return;
    }

    if (oldPass !== user.password) {
      alert("Mật khẩu cũ không đúng");
      return;
    }

    if(newPass !== confirmPass){
      alert("Mật khẩu nhập lại không khớp")
      return
    }

    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      password: newPass,
    };

    await axios.patch(
      `http://localhost:3000/users/${user.id}`,
      updatedUser
    );

    localStorage.setItem("user",JSON.stringify(updatedUser))

    setUser(updatedUser)

    setOldPass("")
    setNewPass("")
    setConfirmPass("")

    setOpen(true)

  }

  if(!user) return null

  return(

  <Box sx={{background:"#f6f8fb",minHeight:"100vh",py:6}}>

  <Container maxWidth="lg">

  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, '@media (min-width: 900px)': { gridTemplateColumns: '1fr 2fr' } }}>

  {/* SIDEBAR */}

  <Box sx={{}}>

  <Paper elevation={3} sx={{p:3,borderRadius:3}}>

  <Box textAlign="center">

  <Avatar
  src={user.avatar || "https://i.pravatar.cc/150"}
  sx={{width:90,height:90,mx:"auto",mb:1}}
  />

  <Typography fontWeight="bold" fontSize={18}>
  {user.name}
  </Typography>

  <Typography fontSize={13} color="gray">
  {user.email}
  </Typography>

  </Box>

  <Divider sx={{my:2}}/>

  <Button fullWidth sx={{justifyContent:"flex-start"}} onClick={()=>setTab("profile")}>
  Thông tin cá nhân
  </Button>

  <Button fullWidth sx={{justifyContent:"flex-start"}} onClick={()=>setTab("orders")}>
  Đơn hàng của tôi
  </Button>

  <Button fullWidth sx={{justifyContent:"flex-start"}} onClick={()=>setTab("password")}>
  Đổi mật khẩu
  </Button>

  <Divider sx={{my:2}}/>

  <Button fullWidth color="error" variant="outlined" onClick={logout}>
  Đăng xuất
  </Button>

  </Paper>

  </Box>

  {/* CONTENT */}

  <Box>

  <Paper elevation={3} sx={{p:4,borderRadius:3}}>

  {/* PROFILE */}

  {tab === "profile" && (

  <Box>

  <Typography variant="h6" fontWeight="bold" mb={3}>
  Thông tin cá nhân
  </Typography>

  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, '@media (min-width: 900px)': { gridTemplateColumns: '1fr 1fr' } }}>

  <Box>
  <TextField
  fullWidth
  label="Họ tên"
  value={name}
  onChange={(e)=>setName(e.target.value)}
  />
  </Box>

  <Box>
  <TextField
  fullWidth
  label="Email"
  value={user.email}
  disabled
  />
  </Box>

  <Box>
  <TextField
  fullWidth
  label="Số điện thoại"
  value={phone}
  onChange={(e)=>setPhone(e.target.value)}
  />
  </Box>

  </Box>

  <Button variant="contained" sx={{mt:3}} onClick={updateProfile}>
  Cập nhật
  </Button>

  </Box>

  )}

  {/* ORDERS */}

  {tab === "orders" && (

  <Box>

  <Typography variant="h6" fontWeight="bold" mb={3}>
  Đơn hàng của tôi
  </Typography>

  {orders.length === 0 && (
  <Typography color="gray">
  Chưa có đơn hàng
  </Typography>
  )}

  {orders.map(order=>(

  <Card key={order.id} sx={{mb:2,borderRadius:3}}>

  <CardContent>

  <Box display="flex" justifyContent="space-between">

  <Typography fontWeight="bold">
  Đơn hàng #{order.id}
  </Typography>

  <Typography fontSize={13}>
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

  <Typography variant="h6" fontWeight="bold" mb={3}>
  Đổi mật khẩu
  </Typography>

  <TextField
  fullWidth
  label="Mật khẩu cũ"
  type="password"
  sx={{mb:2}}
  value={oldPass}
  onChange={(e)=>setOldPass(e.target.value)}
  />

  <TextField
  fullWidth
  label="Mật khẩu mới"
  type="password"
  sx={{mb:2}}
  value={newPass}
  onChange={(e)=>setNewPass(e.target.value)}
  />

  <TextField
  fullWidth
  label="Nhập lại mật khẩu"
  type="password"
  value={confirmPass}
  onChange={(e)=>setConfirmPass(e.target.value)}
  />

  <Button variant="contained" sx={{mt:3}} onClick={changePassword}>
  Đổi mật khẩu
  </Button>

  </Box>

  )}

  </Paper>

  </Box>

  </Box>

  </Container>

  <Snackbar
  open={open}
  autoHideDuration={2000}
  onClose={()=>setOpen(false)}
  >
  <Alert severity="success">
  Cập nhật thành công
  </Alert>
  </Snackbar>

  </Box>

  )

}

export default MyAccount
