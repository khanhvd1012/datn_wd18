import React, { useEffect, useState } from "react";
import axios from "axios";

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
  IconButton
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number
  productId: number
  name: string
  img: string
  price: number
  quantity: number
}

const Checkout = () => {

const [cart,setCart] = useState<CartItem[]>([])
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [phone,setPhone] = useState("")
const [address,setAddress] = useState("")
const [coupon,setCoupon] = useState("")
const [couponDiscount,setCouponDiscount] = useState(0)
const [paymentMethod,setPaymentMethod] = useState("cod")
const [loading,setLoading] = useState(false)
const [openSnackbar,setOpenSnackbar] = useState(false)

const navigate = useNavigate()

useEffect(()=>{

axios.get("http://localhost:3000/cart")
.then(res=>setCart(res.data))

const user = JSON.parse(localStorage.getItem("user") || "null")

if(user){
setName(user.name || "")
setEmail(user.email || "")
setPhone(user.phone || "")
}

},[])

const subTotal = cart.reduce(
(sum,item)=>sum + item.price * item.quantity,0
)

const shippingFee = subTotal > 500000 ? 0 : 30000
const discount = subTotal > 1000000 ? subTotal * 0.1 : 0
const total = subTotal + shippingFee - discount - couponDiscount

const updateQuantity = async(id:number,newQuantity:number)=>{

if(newQuantity < 1) return

await axios.patch(`http://localhost:3000/cart/${id}`,{
quantity:newQuantity
})

setCart(prev =>
prev.map(item =>
item.id === id ? {...item,quantity:newQuantity}:item
)
)

}

const removeItem = async(id:number)=>{

await axios.delete(`http://localhost:3000/cart/${id}`)
setCart(prev => prev.filter(item => item.id !== id))

}

const applyCoupon = ()=>{

if(coupon === "SALE10"){
setCouponDiscount(subTotal*0.1)
alert("Áp dụng mã thành công")
}else{
alert("Mã không hợp lệ")
}

}

const handlePlaceOrder = async()=>{

if(!name || !phone || !address){
alert("Nhập đầy đủ thông tin")
return
}

try{

setLoading(true)

await axios.post("http://localhost:3000/orders",{

customerName:name,
email,
phone,
address,
paymentMethod,
items:cart,
total,
createdAt:new Date()

})

await Promise.all(
cart.map(item =>
axios.delete(`http://localhost:3000/cart/${item.id}`)
)
)

setOpenSnackbar(true)

setTimeout(()=>{
navigate("/order-success")
},1500)

}catch{

alert("Lỗi đặt hàng")

}finally{

setLoading(false)

}

}

return(

<Box sx={{background:"#f5f5f5",minHeight:"100vh",py:5}}>

<Container maxWidth="lg">

{/* HEADER */}

<Box mb={4}>

<Typography variant="h4" fontWeight="bold">
Thanh toán
</Typography>

<Typography color="text.secondary">
Hoàn tất thông tin để đặt hàng
</Typography>

</Box>

{/* STEP CHECKOUT */}

<Box
display="flex"
justifyContent="center"
gap={6}
mb={4}
>

<Typography color="success.main">
✓ Giỏ hàng
</Typography>

<Typography fontWeight="bold">
● Thanh toán
</Typography>

<Typography color="gray">
○ Hoàn tất
</Typography>

</Box>

<Grid container spacing={4}>

{/* LEFT - CART */}

<Grid item xs={12} md={7}>

<Card sx={{borderRadius:3}}>

<CardContent>

<Typography variant="h6" fontWeight="bold" mb={2}>
Sản phẩm của bạn
</Typography>

{cart.map(item=>(

<Box
key={item.id}
display="flex"
justifyContent="space-between"
alignItems="center"
py={2}
>

<Box display="flex" gap={2}>

<Avatar
src={item.img}
variant="rounded"
sx={{width:70,height:70}}
/>

<Box>

<Typography fontWeight="bold">
{item.name}
</Typography>

<Typography color="#d70018" fontWeight="bold">
{item.price.toLocaleString()}₫
</Typography>

<Box display="flex" alignItems="center">

<IconButton
onClick={()=>updateQuantity(item.id,item.quantity-1)}
>
<RemoveIcon/>
</IconButton>

<Typography mx={1}>
{item.quantity}
</Typography>

<IconButton
onClick={()=>updateQuantity(item.id,item.quantity+1)}
>
<AddIcon/>
</IconButton>

</Box>

</Box>

</Box>

<Button
color="error"
onClick={()=>removeItem(item.id)}
>
Xóa
</Button>

</Box>

))}

</CardContent>

</Card>

</Grid>

{/* RIGHT - SUMMARY */}

<Grid item xs={12} md={5}>

<Paper
sx={{
p:4,
borderRadius:3,
position:"sticky",
top:20
}}
>

<Typography variant="h6" fontWeight="bold" mb={3}>
Thông tin giao hàng
</Typography>

<Box display="flex" flexDirection="column" gap={2}>

<TextField
label="Họ tên"
value={name}
onChange={e=>setName(e.target.value)}
fullWidth
/>

<TextField
label="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
fullWidth
/>

<TextField
label="Số điện thoại"
value={phone}
onChange={e=>setPhone(e.target.value)}
fullWidth
/>

<TextField
label="Địa chỉ"
value={address}
onChange={e=>setAddress(e.target.value)}
fullWidth
/>

</Box>

<Divider sx={{my:3}}/>

<Typography fontWeight="bold" mb={2}>
Phương thức thanh toán
</Typography>

<RadioGroup
value={paymentMethod}
onChange={e=>setPaymentMethod(e.target.value)}
>

<FormControlLabel
value="cod"
control={<Radio/>}
label="Thanh toán khi nhận hàng"
/>

<FormControlLabel
value="bank"
control={<Radio/>}
label="Chuyển khoản"
/>

<FormControlLabel
value="momo"
control={<Radio/>}
label="Ví MoMo"
/>

<FormControlLabel
value="vnpay"
control={<Radio/>}
label="VNPay"
/>

</RadioGroup>

<Divider sx={{my:3}}/>

<Box display="flex" justifyContent="space-between">
<Typography>Tạm tính</Typography>
<Typography>{subTotal.toLocaleString()}₫</Typography>
</Box>

<Box display="flex" justifyContent="space-between">
<Typography>Phí ship</Typography>
<Typography>
{shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString()+"₫"}
</Typography>
</Box>

<Divider sx={{my:2}}/>

<Box display="flex" justifyContent="space-between" mb={3}>

<Typography variant="h6">
Tổng tiền
</Typography>

<Typography
variant="h6"
color="#d70018"
fontWeight="bold"
>
{total.toLocaleString()}₫
</Typography>

</Box>

<Button
fullWidth
variant="contained"
sx={{
background:"#d70018",
py:1.5,
fontWeight:"bold",
fontSize:16
}}
onClick={handlePlaceOrder}
disabled={loading}
>

{loading
? <CircularProgress size={24}/>
: "Đặt hàng"}

</Button>

</Paper>

</Grid>

</Grid>

</Container>

<Snackbar open={openSnackbar} autoHideDuration={2000}>
<Alert severity="success">
Đặt hàng thành công
</Alert>
</Snackbar>

</Box>

)

}

export default Checkout