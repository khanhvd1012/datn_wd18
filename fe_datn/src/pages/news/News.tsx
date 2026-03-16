import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box
} from "@mui/material";

import { Link } from "react-router-dom";

/* DATA */

const news = [
  {
    id: 1,
    title: "iPhone 16 sắp ra mắt",
    img: "https://picsum.photos/900/500?1",
    date: "12/03/2026",
    desc: "Apple chuẩn bị ra mắt iPhone thế hệ mới với nhiều nâng cấp AI và camera."
  },
  {
    id: 2,
    title: "Samsung Galaxy S mới",
    img: "https://picsum.photos/600/350?2",
    date: "10/03/2026",
    desc: "Samsung giới thiệu dòng Galaxy mới với màn hình AMOLED."
  },
  {
    id: 3,
    title: "Laptop AI 2026",
    img: "https://picsum.photos/600/350?3",
    date: "08/03/2026",
    desc: "Laptop tích hợp AI đang trở thành xu hướng công nghệ."
  },
  {
    id: 4,
    title: "Xu hướng điện thoại gập",
    img: "https://picsum.photos/600/350?4",
    date: "05/03/2026",
    desc: "Điện thoại màn hình gập đang trở thành xu hướng mới."
  }
];

const News = () => {

  return (

<Box>

{/* HERO */}

<Box
sx={{
height:300,
backgroundImage:`
linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),
url("https://images.unsplash.com/photo-1518779578993-ec3579fee39f")
`,
backgroundSize:"cover",
backgroundPosition:"center",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"white"
}}
>

<Typography variant="h3" fontWeight="bold">
Tin tức công nghệ
</Typography>

</Box>


<Container sx={{py:6}}>

{/* FEATURED NEWS */}

<Card
component={Link}
to={`/news/${news[0].id}`}
sx={{
mb:6,
borderRadius:3,
overflow:"hidden",
textDecoration:"none"
}}
>

<CardMedia
component="img"
height="420"
image={news[0].img}
/>

<CardContent>

<Typography color="text.secondary" fontSize={14}>
{news[0].date}
</Typography>

<Typography variant="h4" fontWeight="bold" mt={1}>
{news[0].title}
</Typography>

<Typography mt={1} mb={2}>
{news[0].desc}
</Typography>

<Button
variant="contained"
sx={{
background:"#ff6a00",
":hover":{background:"#e65100"}
}}
>

Đọc tiếp

</Button>

</CardContent>

</Card>


{/* NEWS GRID */}

<Grid container spacing={4}>

{news.slice(1).map((item)=>(

<Grid item xs={12} md={4} key={item.id}>

<Card
component={Link}
to={`/news/${item.id}`}
sx={{
borderRadius:3,
overflow:"hidden",
textDecoration:"none",
transition:"0.3s",
cursor:"pointer",
"&:hover img":{
transform:"scale(1.1)"
},
"&:hover":{
boxShadow:8
}
}}
>

<Box sx={{overflow:"hidden"}}>

<CardMedia
component="img"
height="220"
image={item.img}
sx={{transition:"0.4s"}}
/>

</Box>

<CardContent>

<Typography fontSize={13} color="text.secondary">
{item.date}
</Typography>

<Typography fontWeight="bold" mt={1} mb={1}>
{item.title}
</Typography>

<Typography variant="body2" color="text.secondary">
{item.desc}
</Typography>

</CardContent>

</Card>

</Grid>

))}

</Grid>

</Container>

</Box>

  );
};

export default News;