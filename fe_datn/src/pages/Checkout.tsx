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

useEffect(() => {
  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.cart && response.data.cart.items) {
        setCart(response.data.cart.items);
      }
    } catch (error: any) {
      console.error("Error loading cart:", error);
      
      // Xử lý lỗi token hết hạn
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || "";
        if (errorMessage.includes("hết hạn") || errorMessage.includes("không hợp lệ")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }
      }
      
      alert("Không thể tải giỏ hàng");
    }
  };

  loadCart();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user) {
    setName(user.username || user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }
}, [navigate]);

const subTotal = cart.reduce(
  (sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0
)

const shippingFee = subTotal > 500000 ? 0 : 30000
const discount = subTotal > 1000000 ? subTotal * 0.1 : 0
const total = subTotal + shippingFee - discount - couponDiscount

const updateQuantity = async (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) return;

  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:3000/api/cart/update/${itemId}`,
      { quantity: newQuantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setCart(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Không thể cập nhật số lượng");
  }
};

const removeItem = async (itemId: string) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/api/cart/remove/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setCart(prev => prev.filter(item => item._id !== itemId));
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Không thể xóa sản phẩm");
  }
};

const applyCoupon = ()=>{

if(coupon === "SALE10"){
setCouponDiscount(subTotal*0.1)
alert("Áp dụng mã thành công")
}else{
alert("Mã không hợp lệ")
}

}

const handlePlaceOrder = async () => {
  if (!name || !phone || !address) {
    alert("Nhập đầy đủ thông tin");
    return;
  }

  if (!email) {
    alert("Email không được để trống");
    return;
  }

  if (cart.length === 0) {
    alert("Giỏ hàng trống");
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await axios.post(
      "http://localhost:3000/api/orders",
      {
        shipping_info: {
          name,
          email,
          phone,
          address
        },
        payment_method: paymentMethod,
        coupon_code: coupon || null,
        notes: ""
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data && response.data.order) {
      const orderId = response.data.order._id;

      // Xử lý thanh toán theo phương thức
      if (paymentMethod === "cod") {
        // COD: Chuyển đến trang thành công
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/order-success", { state: { orderId } });
        }, 1500);
      } else if (paymentMethod === "bank") {
        // Bank transfer: Chuyển đến trang hiển thị thông tin chuyển khoản
        navigate("/payment/bank", { state: { orderId } });
      } else if (paymentMethod === "vnpay" || paymentMethod === "momo") {
        // VNPay/MoMo: Chuyển đến trang thanh toán online
        navigate("/payment/process", { 
          state: { 
            orderId, 
            paymentMethod 
          } 
        });
      }
    }
    } catch (error: any) {
      console.error("Error placing order:", error);
      
      // Xử lý lỗi token hết hạn
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || "";
        if (errorMessage.includes("hết hạn") || errorMessage.includes("không hợp lệ")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }
      }
      
      const errorMessage = error.response?.data?.message || "Lỗi đặt hàng";
      alert(errorMessage);
    } finally {
    setLoading(false);
  }
};

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

{cart.map((item) => {
  const productName = item.product_id?.name || "";
  const variantName = item.variant_id?.name || "";
  const displayName = variantName ? `${productName} - ${variantName}` : productName;
  const imageUrl = item.product_id?.images?.[0] || "";
  const itemPrice = item.price || 0;

  return (
    <Box
      key={item._id}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <Box display="flex" gap={2}>
        <Avatar
          src={imageUrl}
          variant="rounded"
          sx={{ width: 70, height: 70 }}
        />
        <Box>
          <Typography fontWeight="bold">
            {displayName}
          </Typography>
          <Typography color="#d70018" fontWeight="bold">
            {itemPrice.toLocaleString()}₫
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
            >
              <RemoveIcon />
            </IconButton>
            <Typography mx={1}>
              {item.quantity}
            </Typography>
            <IconButton
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Button
        color="error"
        onClick={() => removeItem(item._id)}
      >
        Xóa
      </Button>
    </Box>
  );
})}

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