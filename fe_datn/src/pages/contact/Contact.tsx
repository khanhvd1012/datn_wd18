import React, { useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Fab
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import ChatIcon from "@mui/icons-material/Chat";

const Contact = () => {

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post("http://localhost:3000/contacts", form);

      setOpen(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (

<Box sx={{ background: "#f6f8fb" }}>

{/* BANNER */}

<Box
sx={{
height:360,
backgroundImage:
"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url(https://images.unsplash.com/photo-1521790797524-b2497295b8a0)",
backgroundSize:"cover",
backgroundPosition:"center",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}
>

<Box textAlign="center">

<Typography variant="h2" fontWeight="bold" color="white">
Liên hệ với chúng tôi
</Typography>

<Typography color="white" mt={2}>
Chúng tôi luôn sẵn sàng hỗ trợ bạn
</Typography>

</Box>

</Box>


{/* CONTACT CARDS */}

<Container maxWidth="lg" sx={{ mt:-8 }}>

<Grid container spacing={4} justifyContent="center">

{[
{
icon:<LocationOnIcon sx={{fontSize:45,color:"#ff5722"}}/>,
title:"Địa chỉ",
text:"13 Trịnh Văn Bô, Hà Nội"
},
{
icon:<PhoneIcon sx={{fontSize:45,color:"#1976d2"}}/>,
title:"Hotline",
text:"0987 654 321"
},
{
icon:<EmailIcon sx={{fontSize:45,color:"#4caf50"}}/>,
title:"Email",
text:"support@shop.com"
}
].map((item,index)=>(

<Grid item xs={12} md={4} key={index}>

<Paper
sx={{
p:5,
borderRadius:4,
textAlign:"center",
transition:"0.3s",
":hover":{
transform:"translateY(-10px)",
boxShadow:10
}
}}
>

{item.icon}

<Typography fontWeight="bold" mt={2}>
{item.title}
</Typography>

<Typography>
{item.text}
</Typography>

</Paper>

</Grid>

))}

</Grid>

</Container>


{/* FORM */}

<Container sx={{py:10}}>

<Grid container spacing={5}>

<Grid item xs={12} md={6}>

<Paper sx={{p:6,borderRadius:4}}>

<Typography variant="h5" fontWeight="bold" mb={4}>
Gửi tin nhắn
</Typography>

<Box component="form" onSubmit={handleSubmit}>

<Stack spacing={3}>

<TextField
label="Họ và tên"
name="name"
value={form.name}
onChange={handleChange}
fullWidth
InputProps={{
startAdornment:(
<InputAdornment position="start">
<PersonIcon/>
</InputAdornment>
)
}}
/>

<TextField
label="Email"
name="email"
value={form.email}
onChange={handleChange}
fullWidth
InputProps={{
startAdornment:(
<InputAdornment position="start">
<EmailIcon/>
</InputAdornment>
)
}}
/>

<TextField
label="Số điện thoại"
name="phone"
value={form.phone}
onChange={handleChange}
fullWidth
InputProps={{
startAdornment:(
<InputAdornment position="start">
<PhoneIcon/>
</InputAdornment>
)
}}
/>

<TextField
label="Nội dung"
name="message"
value={form.message}
onChange={handleChange}
multiline
rows={4}
fullWidth
InputProps={{
startAdornment:(
<InputAdornment position="start">
<MessageIcon/>
</InputAdornment>
)
}}
/>

<Button
type="submit"
variant="contained"
size="large"
sx={{height:50,fontWeight:"bold"}}
>
Gửi liên hệ
</Button>

</Stack>

</Box>

</Paper>

</Grid>


{/* MAP */}

<Grid item xs={12} md={6}>

<Paper
sx={{
borderRadius:4,
overflow:"hidden",
height:"100%"
}}
>

<iframe
title="map"
src="https://maps.google.com/maps?q=13%20Tr%E1%BB%8Bnh%20V%C4%83n%20B%C3%B4%20H%C3%A0%20N%E1%BB%99i&t=&z=15&ie=UTF8&iwloc=&output=embed"
width="100%"
height="100%"
style={{border:0}}
/>

</Paper>

</Grid>

</Grid>

</Container>


{/* ALERT */}

<Snackbar
open={open}
autoHideDuration={3000}
onClose={()=>setOpen(false)}
>

<Alert severity="success">
Gửi liên hệ thành công
</Alert>

</Snackbar>

</Box>

  );

};

export default Contact;