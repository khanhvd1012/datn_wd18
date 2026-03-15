import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Rating,
  TextField,
  Chip,
  Divider,
  Tabs,
  Tab,
  Paper,
  LinearProgress
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product,setProduct] = useState<any>(null);
  const [related,setRelated] = useState<any[]>([]);
  const [img,setImg] = useState("");
  const [qty,setQty] = useState(1);
  const [tab,setTab] = useState(0);

  const [reviews,setReviews] = useState<any[]>([]);
  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState("");

  const [time,setTime] = useState(3600);

  /* FLASH SALE TIMER */

  useEffect(()=>{

    const timer=setInterval(()=>{
      setTime(prev=>prev>0?prev-1:0)
    },1000)

    return()=>clearInterval(timer)

  },[])

  const formatPrice=(price:number)=>{
    return price?.toLocaleString("vi-VN")+"₫"
  }

  /* LOAD PRODUCT */

  useEffect(()=>{

    axios
      .get(`http://localhost:3000/products/${id}`)
      .then(res=>{
        setProduct(res.data)
        setImg(res.data.img)
      })

  },[id])

  /* RELATED PRODUCTS */

  useEffect(()=>{

    axios
      .get(`http://localhost:3000/products?_limit=4`)
      .then(res=>{
        const list=res.data.filter((p:any)=>p.id!==Number(id))
        setRelated(list)
      })

  },[id])

  /* LOAD REVIEWS */

  useEffect(()=>{

    axios
      .get(`http://localhost:3000/reviews?productId=${id}`)
      .then(res=>{
        setReviews(res.data)
      })

  },[id])

  /* ADD TO CART */

  const addToCart = async () => {

    try {

      const res = await axios.get(
        `http://localhost:3000/cart?productId=${product.id}`
      );

      const data = res.data;

      if (data.length > 0) {

        const item = data[0];

        await axios.patch(
          `http://localhost:3000/cart/${item.id}`,
          {
            quantity: item.quantity + qty
          }
        );

      } else {

        await axios.post(
          "http://localhost:3000/cart",
          {
            productId: product.id,
            name: product.name,
            img: product.img,
            price: product.price,
            quantity: qty
          }
        );

      }

      // cập nhật header
      window.dispatchEvent(new Event("cartUpdated"));

      alert("Đã thêm vào giỏ hàng");

    } catch (error) {

      console.error("Add cart error:", error);

    }

  }

  /* SUBMIT REVIEW */

  const submitReview=async()=>{

    if(!comment) return

    const newReview={
      productId:Number(id),
      user:"User Demo",
      rating,
      comment,
      date:new Date().toLocaleDateString()
    }

    const res=await axios.post(
      "http://localhost:3000/reviews",
      newReview
    )

    setReviews([...reviews,res.data])

    setComment("")
    setRating(5)

  }

  const total=reviews.length

  const avg=total
  ?reviews.reduce((a,b)=>a+b.rating,0)/total
  :0

  const countStar=(star:number)=>{
    return reviews.filter(r=>r.rating===star).length
  }

  if(!product){

    return(
      <Typography textAlign="center" mt={10}>
        Loading...
      </Typography>
    )

  }

  return(

  <Box sx={{background:"#f5f5f5",py:6}}>

  <Container maxWidth="lg">

  <Card sx={{p:4,borderRadius:4}}>

  <Grid container spacing={6}>

  {/* IMAGE */}

  <Grid item xs={12} md={5}>

  <Box
  component="img"
  src={img}
  sx={{
  width:"100%",
  height:420,
  objectFit:"contain",
  borderRadius:3
  }}
  />

  <Stack direction="row" spacing={1} mt={2}>

  {[product.img,product.img,product.img].map((i,index)=>(

  <Box
  key={index}
  component="img"
  src={i}
  onClick={()=>setImg(i)}
  sx={{
  width:70,
  height:70,
  border:"1px solid #ddd",
  borderRadius:2,
  cursor:"pointer",
  p:1
  }}
  />

  ))}

  </Stack>

  </Grid>

  {/* INFO */}

  <Grid item xs={12} md={7}>

  <Stack spacing={2}>

  <Typography variant="h5" fontWeight="bold">
  {product.name}
  </Typography>

  <Rating value={avg} precision={0.5} readOnly/>

  <Typography variant="h4" fontWeight="bold" color="#d70018">
  {formatPrice(product.price)}
  </Typography>

  <Chip
  label={`Flash Sale ${Math.floor(time/60)}:${time%60}`}
  color="error"
  />

  <Stack direction="row" spacing={1}>
  <Chip label="Voucher 50K"/>
  <Chip label="Freeship"/>
  </Stack>

  <Stack direction="row" spacing={1} alignItems="center">
  <LocalShippingIcon/>
  <Typography>
  Giao hàng toàn quốc
  </Typography>
  </Stack>

  <Divider/>

  {/* QUANTITY */}

  <Stack direction="row" spacing={1} alignItems="center">

  <IconButton onClick={()=>setQty(qty>1?qty-1:1)}>
  <RemoveIcon/>
  </IconButton>

  <TextField
  size="small"
  value={qty}
  onChange={(e)=>setQty(Number(e.target.value))}
  sx={{width:70}}
  inputProps={{style:{textAlign:"center"}}}
  />

  <IconButton onClick={()=>setQty(qty+1)}>
  <AddIcon/>
  </IconButton>

  </Stack>

  {/* BUTTON */}

  <Stack direction="row" spacing={2}>

  <Button
  variant="contained"
  startIcon={<ShoppingCartIcon/>}
  sx={{flex:1,background:"#ff6b35"}}
  onClick={addToCart}
  >
  Thêm giỏ hàng
  </Button>

  <Button
  variant="contained"
  sx={{flex:1,background:"#d70018"}}
  onClick={()=>{
  addToCart()
  navigate("/checkout")
  }}
  >
  Mua ngay
  </Button>

  <IconButton>
  <FavoriteBorderIcon/>
  </IconButton>

  </Stack>

  </Stack>

  </Grid>

  </Grid>

  </Card>

  {/* TABS */}

  <Box mt={5}>

  <Tabs value={tab} onChange={(e,v)=>setTab(v)}>
  <Tab label="Mô tả"/>
  <Tab label="Đánh giá"/>
  </Tabs>

  <Paper sx={{p:3,mt:2}}>

  {tab===0 && (
  <Typography>
  {product.description}
  </Typography>
  )}

  {tab===1 && (

  <Box>

  <Grid container spacing={4} mb={4}>

  <Grid item md={3}>

  <Typography variant="h3" color="error">
  {avg.toFixed(1)}
  </Typography>

  <Rating value={avg} precision={0.5} readOnly/>

  <Typography>
  {total} đánh giá
  </Typography>

  </Grid>

  <Grid item md={9}>

  {[5,4,3,2,1].map(star=>{

  const percent=total
  ?(countStar(star)/total)*100
  :0

  return(

  <Stack key={star} direction="row" spacing={2} alignItems="center">

  <Typography>{star}⭐</Typography>

  <LinearProgress
  variant="determinate"
  value={percent}
  sx={{flex:1,height:10,borderRadius:5}}
  />

  </Stack>

  )

  })}

  </Grid>

  </Grid>

  {/* REVIEW FORM */}

  <Paper sx={{p:3,mb:4}}>

  <Typography variant="h6" mb={2}>
  Viết đánh giá
  </Typography>

  <Stack spacing={2}>

  <Rating
  value={rating}
  onChange={(e,v:any)=>setRating(v)}
  />

  <TextField
  label="Bình luận"
  multiline
  rows={3}
  value={comment}
  onChange={(e)=>setComment(e.target.value)}
  />

  <Button variant="contained" onClick={submitReview}>
  Gửi đánh giá
  </Button>

  </Stack>

  </Paper>

  {/* REVIEW LIST */}

  <Stack spacing={2}>

  {reviews.map(r=>(

  <Paper key={r.id} sx={{p:2}}>

  <Stack direction="row" justifyContent="space-between">

  <Typography fontWeight="bold">
  {r.user}
  </Typography>

  <Typography fontSize={13} color="text.secondary">
  {r.date}
  </Typography>

  </Stack>

  <Rating value={r.rating} readOnly size="small"/>

  <Typography mt={1}>
  {r.comment}
  </Typography>

  </Paper>

  ))}

  </Stack>

  </Box>

  )}

  </Paper>

  </Box>

  {/* RELATED */}

  <Box mt={6}>

  <Typography variant="h5" fontWeight="bold" mb={3}>
  Sản phẩm liên quan
  </Typography>

  <Grid container spacing={3}>

  {related.map(item=>(

  <Grid item xs={12} sm={6} md={3} key={item.id}>

  <Card
  sx={{
  cursor:"pointer",
  "&:hover":{
  transform:"translateY(-6px)",
  boxShadow:6
  }
  }}
  onClick={()=>navigate(`/product/${item.id}`)}
  >

  <CardContent>

  <Box
  component="img"
  src={item.img}
  sx={{
  width:"100%",
  height:160,
  objectFit:"contain"
  }}
  />

  <Typography fontWeight="bold">
  {item.name}
  </Typography>

  <Typography color="#d70018">
  {formatPrice(item.price)}
  </Typography>

  </CardContent>

  </Card>

  </Grid>

  ))}

  </Grid>

  </Box>

  </Container>

  </Box>

  )

}

export default ProductDetail;