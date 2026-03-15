import { useEffect,useState } from "react";
import axios from "axios";
import { Box,Typography,Table,TableHead,TableRow,TableCell,TableBody } from "@mui/material";

interface Order {
  id: number
  customerName: string
  total: number
}

const Orders = ()=>{

const [orders,setOrders] = useState<Order[]>([])

useEffect(()=>{

axios
.get<Order[]>("http://localhost:3000/orders")
.then(res=>setOrders(res.data))

},[])

return(

<Box>

<Typography variant="h4" mb={3}>
Orders
</Typography>

<Table>

<TableHead>

<TableRow>
<TableCell>ID</TableCell>
<TableCell>Customer</TableCell>
<TableCell>Total</TableCell>
</TableRow>

</TableHead>

<TableBody>

{orders.map(o=>(

<TableRow key={o.id}>

<TableCell>{o.id}</TableCell>
<TableCell>{o.customerName}</TableCell>
<TableCell>{o.total}</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</Box>

)

}

export default Orders