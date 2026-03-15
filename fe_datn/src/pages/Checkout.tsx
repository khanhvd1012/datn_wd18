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
IconButton,
Chip,
InputAdornment,
Stepper,
Step,
StepLabel
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useNavigate } from "react-router-dom";

interface CartItem{
id:number
name:string
img:string
price:number
quantity:number
}

const steps = ["Giỏ hàng","Thanh toán","Hoàn tất"]

const Checkout = ()=>{

const [cart,setCart] = useState<CartItem[]>([])
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [phone,setPhone] = useState("")
const [address,setAddress] = useState("")
const [coupon,setCoupon] = useState("")
const [couponDiscount,setCouponDiscount] = useState(0)
const [paymentMethod,setPaymentMethod] = useState("cod")
const [loading,setLoading] = useState(false)

const navigate = useNavigate()

useEffect(()=>{

axios.get("http://localhost:3000/cart")
.then(res=>setCart(res.data))

},[])

const subTotal = cart.reduce(
(sum,item)=> sum + item.price * item.quantity ,0
)

const shipping = subTotal > 500000 ? 0 : 30000

const total = subTotal + shipping - couponDiscount

/* UPDATE QUANTITY */

const updateQuantity = async(id:number,newQuantity:number)=>{

if(newQuantity < 1){
alert("Số lượng phải lớn hơn 0")
return
}

if(newQuantity > 99){
alert("Số lượng tối đa là 99")
return
}

await axios.patch(`http://localhost:3000/cart/${id}`,{
quantity:newQuantity
})

setCart(prev =>
prev.map(item =>
item.id === id
? {...item,quantity:newQuantity}
: item
)
)

window.dispatchEvent(new Event("cartUpdated"))

}

/* REMOVE ITEM */

const removeItem = async(id:number)=>{

await axios.delete(`http://localhost:3000/cart/${id}`)

setCart(prev => prev.filter(item => item.id !== id))

window.dispatchEvent(new Event("cartUpdated"))

}

/* APPLY COUPON */

const applyCoupon = ()=>{

if(!coupon){
alert("Nhập mã giảm giá")
return
}

if(coupon === "SALE10"){

if(subTotal < 500000){
alert("Đơn tối thiểu 500k mới dùng được mã")
return
}

setCouponDiscount(100000)
alert("Áp dụng mã thành công")

}else{

alert("Mã không hợp lệ")

}

}

/* ORDER */

const handleOrder = async()=>{

if(cart.length === 0){
alert("Giỏ hàng trống")
return
}

if(!name.trim()){
alert("Nhập họ tên")
return
}

if(!email.trim()){
alert("Nhập email")
return
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if(!emailRegex.test(email)){
alert("Email không hợp lệ")
return
}

if(!phone.trim()){
alert("Nhập số điện thoại")
return
}

const phoneRegex = /^[0-9]{10}$/
if(!phoneRegex.test(phone)){
alert("Số điện thoại không hợp lệ")
return
}

if(!address.trim()){
alert("Nhập địa chỉ")
return
}

setLoading(true)

await axios.post("http://localhost:3000/orders",{

customerName:name,
email,
phone,
address,
paymentMethod,
items:cart,
total,
status:"pending",
createdAt:new Date()

})

await Promise.all(
cart.map(item =>
axios.delete(`http://localhost:3000/cart/${item.id}`)
)
)

window.dispatchEvent(new Event("cartUpdated"))

navigate("/order-success")

}

return(

<Box
sx={{
background:"#f4f6f8",
minHeight:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
py:6
}}
>

<Container maxWidth="lg">

<Typography
variant="h4"
fontWeight="bold"
textAlign="center"
mb={4}
>
Thanh toán đơn hàng
</Typography>

<Stepper activeStep={1} sx={{mb:5}}>
{steps.map(step=>(
<Step key={step}>
<StepLabel>{step}</StepLabel>
</Step>
))}
</Stepper>

<Grid container spacing={4}>

{/* CART */}

<Grid item xs={12} md={7}>

<Card sx={{borderRadius:4}}>

<CardContent>

<Typography variant="h6" fontWeight="bold" mb={2}>
Sản phẩm ({cart.length})
</Typography>

{cart.map(item=>(

<Box
key={item.id}
display="flex"
justifyContent="space-between"
alignItems="center"
py={2}
borderBottom="1px solid #eee"
>

<Box display="flex" gap={2}>

<Avatar
src={item.img}
variant="rounded"
sx={{width:80,height:80}}
/>

<Box>

<Typography fontWeight="bold">
{item.name}
</Typography>

<Typography color="#d70018">
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

<Box textAlign="right">

<Typography fontWeight="bold">
{(item.price * item.quantity).toLocaleString()}₫
</Typography>

<IconButton
color="error"
onClick={()=>removeItem(item.id)}
>
<DeleteIcon/>
</IconButton>

</Box>

</Box>

))}

</CardContent>

</Card>

</Grid>

{/* CHECKOUT */}

<Grid item xs={12} md={5}>

<Paper sx={{p:4,borderRadius:4}}>

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

<TextField
label="Mã giảm giá"
value={coupon}
onChange={e=>setCoupon(e.target.value)}
InputProps={{
endAdornment:(
<InputAdornment position="end">
<Button onClick={applyCoupon}>
Áp dụng
</Button>
</InputAdornment>
)
}}
/>

</Box>

<Divider sx={{my:3}}/>

<Typography fontWeight="bold" mb={2}>
Thanh toán
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
value="momo"
control={<Radio/>}
label="Ví MoMo"
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
{shipping === 0 ? "Miễn phí" : shipping.toLocaleString()+"₫"}
</Typography>
</Box>

{couponDiscount > 0 &&(

<Box display="flex" justifyContent="space-between">

<Typography>Giảm giá</Typography>

<Typography color="green">
-{couponDiscount.toLocaleString()}₫
</Typography>

</Box>

)}

<Divider sx={{my:2}}/>

<Box display="flex" justifyContent="space-between" mb={3}>

<Typography fontWeight="bold">
Tổng tiền
</Typography>

<Typography
fontWeight="bold"
fontSize={22}
color="#d70018"
>
{total.toLocaleString()}₫
</Typography>

</Box>

<Button
fullWidth
variant="contained"
sx={{
background:"linear-gradient(45deg,#ff512f,#dd2476)",
py:1.5,
fontSize:16,
fontWeight:"bold",
borderRadius:3
}}
onClick={handleOrder}
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

</Box>

)

}

export default Checkout