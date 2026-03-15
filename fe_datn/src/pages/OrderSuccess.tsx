import React,{useEffect,useState} from "react";
import axios from "axios";
import {
Box,
Typography,
Paper,
Stack,
Divider
} from "@mui/material";
import {useParams} from "react-router-dom";

const OrderDetail = () => {

const {id} = useParams()

const [order,setOrder] = useState(null)

useEffect(()=>{

axios.get(`http://localhost:3000/orders/${id}`)
.then(res=>setOrder(res.data))

},[id])

if(!order) return <Typography>Loading...</Typography>

return(

<Box p={4}>

<Typography variant="h4" mb={3}>
Chi tiết đơn #{order.id}
</Typography>

<Paper sx={{p:3}}>

<Typography>
Khách hàng: {order.customerName}
</Typography>

<Typography>
Email: {order.email}
</Typography>

<Typography>
SĐT: {order.phone}
</Typography>

<Typography>
Địa chỉ: {order.address}
</Typography>

<Typography>
Thanh toán: {order.paymentMethod}
</Typography>

<Typography>
Trạng thái: {order.status || "pending"}
</Typography>

<Divider sx={{my:3}}/>

<Stack spacing={2}>

{order.items.map(item=>(

<Paper key={item.id} sx={{p:2}}>

<Stack direction="row" spacing={2} alignItems="center">

<img
src={item.img}
width={70}
alt=""
/>

<Box>

<Typography>
{item.name}
</Typography>

<Typography>
SL: {item.quantity}
</Typography>

<Typography>
Giá: {item.price.toLocaleString()}₫
</Typography>

</Box>

</Stack>

</Paper>

))}

</Stack>

<Divider sx={{my:3}}/>

<Typography variant="h6">

Tổng tiền:
<b style={{color:"#ff5722"}}>
{order.total.toLocaleString()}₫
</b>

</Typography>

</Paper>

</Box>

)

}

export default OrderDetail