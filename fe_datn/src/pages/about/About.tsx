import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const About: React.FC = () => {

  return (

<Box>

<<<<<<< HEAD
{/* HERO BANNER WITH GRADIENT OVERLAY */}

=======
{/* HERO */}
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
<Box
sx={{
height:320,
backgroundImage:`
linear-gradient(
rgba(0,0,0,0.6),
rgba(0,0,0,0.5)
),
url("https://images.unsplash.com/photo-1519389950473-47ba0277781c")
`,
backgroundSize:"cover",
backgroundPosition:"center",
display:"flex",
alignItems:"center",
justifyContent:"center",
textAlign:"center",
color:"white"
}}
>

<Box>

<<<<<<< HEAD
<Typography
variant="h3"
fontWeight="bold"
>

Về chúng tôi

</Typography>

<Typography mt={1}>

Cửa hàng công nghệ uy tín hàng đầu

=======
<Typography variant="h3" fontWeight="bold">
Về chúng tôi
</Typography>

<Typography mt={1}>
Cửa hàng công nghệ uy tín hàng đầu
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
</Typography>

</Box>

</Box>


<<<<<<< HEAD
{/* INTRO SECTION */}

=======
{/* INTRO */}
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
<Container sx={{py:8}}>

<Grid container spacing={5} alignItems="center">

<<<<<<< HEAD
<Grid item component="div" xs={12} md={6}>

=======
<Grid item xs={12} md={6}>
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
<img
src="https://images.unsplash.com/photo-1556742031-c6961e8560b0"
style={{
width:"100%",
borderRadius:12
}}
/>
<<<<<<< HEAD

</Grid>

<Grid item component="div" xs={12} md={6}>

<Typography
variant="h4"
fontWeight="bold"
mb={2}
>

Chúng tôi là ai?

</Typography>

<Typography color="text.secondary">

=======
</Grid>

<Grid item xs={12} md={6}>

<Typography variant="h4" fontWeight="bold" mb={2}>
Chúng tôi là ai?
</Typography>

<Typography color="text.secondary">
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
Chúng tôi chuyên cung cấp các sản phẩm công nghệ chính hãng
như điện thoại, laptop và phụ kiện. Với nhiều năm kinh nghiệm
trong lĩnh vực bán lẻ, chúng tôi cam kết mang đến sản phẩm
chất lượng cao cùng dịch vụ chăm sóc khách hàng tốt nhất.
<<<<<<< HEAD

=======
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
</Typography>

</Grid>

</Grid>

</Container>


{/* STATS */}
<<<<<<< HEAD

=======
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
<Box sx={{background:"#f5f5f5",py:8}}>

<Container>

<Grid container spacing={4}>

{[
{number:"10+",label:"Năm kinh nghiệm"},
{number:"5000+",label:"Khách hàng"},
{number:"1000+",label:"Sản phẩm"},
{number:"24/7",label:"Hỗ trợ khách hàng"}
].map((item,index)=>(

<<<<<<< HEAD
<Grid item component="div" xs={6} md={3} key={index}>
=======
<Grid item xs={6} md={3} key={index}>
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa

<Paper
sx={{
p:4,
textAlign:"center",
borderRadius:3,
transition:"0.3s",
cursor:"pointer",
":hover":{
transform:"translateY(-8px)",
boxShadow:6
}
}}
>

<Typography
variant="h4"
fontWeight="bold"
color="#ff6a00"
>
<<<<<<< HEAD

{item.number}

</Typography>

<Typography>

{item.label}

=======
{item.number}
</Typography>

<Typography>
{item.label}
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
</Typography>

</Paper>

</Grid>

))}

</Grid>

</Container>

</Box>


{/* WHY CHOOSE US */}
<<<<<<< HEAD

=======
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
<Container sx={{py:8}}>

<Typography
variant="h4"
fontWeight="bold"
textAlign="center"
mb={6}
>
<<<<<<< HEAD

Tại sao chọn chúng tôi

</Typography>

<Grid container spacing={4}>
=======
Tại sao chọn chúng tôi
</Typography>

<Grid 
container 
spacing={4} 
justifyContent="center"
alignItems="stretch"
>
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa

{[
{
icon:<LocalShippingIcon sx={{fontSize:45,color:"#ff6a00"}}/>,
title:"Giao hàng nhanh",
text:"Giao hàng toàn quốc nhanh chóng và an toàn"
},
{
<<<<<<< HEAD
icon:<SecurityIcon sx={{fontSize:45,color:"#1976d2"}}/>,
=======
icon:<SecurityIcon sx={{fontSize:45,color:"#ff6a00"}}/>,
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
title:"Sản phẩm chính hãng",
text:"100% sản phẩm chính hãng có bảo hành"
},
{
<<<<<<< HEAD
icon:<SupportAgentIcon sx={{fontSize:45,color:"#2e7d32"}}/>,
=======
icon:<SupportAgentIcon sx={{fontSize:45,color:"#ff6a00"}}/>,
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
title:"Hỗ trợ 24/7",
text:"Đội ngũ hỗ trợ khách hàng chuyên nghiệp"
}
].map((item,index)=>(

<<<<<<< HEAD
<Grid item component="div" xs={12} md={4} key={index}>
=======
<Grid item xs={12} sm={4} key={index}>
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa

<Paper
sx={{
p:4,
textAlign:"center",
borderRadius:3,
transition:"0.3s",
<<<<<<< HEAD
=======
height:"100%",
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
":hover":{
transform:"translateY(-10px)",
boxShadow:6
}
}}
>

{item.icon}

<<<<<<< HEAD
<Typography
fontWeight="bold"
mt={2}
mb={1}
>

{item.title}

</Typography>

<Typography color="text.secondary">

{item.text}

=======
<Typography fontWeight="bold" mt={2} mb={1}>
{item.title}
</Typography>

<Typography color="text.secondary">
{item.text}
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
</Typography>

</Paper>

</Grid>

))}

</Grid>

</Container>

</Box>

  );

};

export default About;