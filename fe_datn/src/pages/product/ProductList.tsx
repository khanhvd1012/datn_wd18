import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Pagination,
  Button,
  Stack,
  FormControl,
  InputLabel,
  TextField,
  Rating,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  InputAdornment
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SearchIcon from "@mui/icons-material/Search";

import { Link, useSearchParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  category?: string;
  sold?: number;
  discount?: number;
  rating?: number;
}

const ProductList = () => {

  const [products,setProducts] = useState<Product[]>([]);
  const [page,setPage] = useState(1);
  const [search,setSearch] = useState("");
  const [sortType,setSortType] = useState("default");
  const [open,setOpen] = useState(false);

  const productsPerPage = 8;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");

  useEffect(()=>{

    fetch("http://localhost:3000/products")
      .then(res=>res.json())
      .then(data=>setProducts(data))

  },[])

  const formatPrice = (price:number)=>
    price.toLocaleString("vi-VN")+" đ";

  const filteredProducts = useMemo(()=>{

    let filtered = [...products];

    // lọc category
    if(category){
      filtered = filtered.filter(p=>p.category===category)
    }

    // search
    if(search){
      filtered = filtered.filter(p=>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // sort
    if(sortType==="priceAsc")
      filtered.sort((a,b)=>a.price-b.price)

    if(sortType==="priceDesc")
      filtered.sort((a,b)=>b.price-a.price)

    return filtered

  },[products,search,sortType,category])

  const totalPages = Math.ceil(filteredProducts.length/productsPerPage)

  const displayedProducts = filteredProducts.slice(
    (page-1)*productsPerPage,
    page*productsPerPage
  )

  const addToCart = async(product:Product)=>{

    const res = await fetch(
      `http://localhost:3000/cart?productId=${product.id}`
    )

    const data = await res.json()

    if(data.length>0){

      const item = data[0]

      await fetch(`http://localhost:3000/cart/${item.id}`,{
        method:"PATCH",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          quantity:item.quantity+1
        })
      })

    }else{

      await fetch(`http://localhost:3000/cart`,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          productId:product.id,
          name:product.name,
          img:product.img,
          price:product.price,
          quantity:1
        })
      })

    }

    setOpen(true)

  }

  return(

    <Box sx={{maxWidth:1300,mx:"auto",p:3,background:"#fafafa"}}>

      {/* CATEGORY FILTER */}

      {category && (

        <Stack direction="row" spacing={2} mb={2}>

          <Chip
            label={`Danh mục: ${category}`}
            color="primary"
          />

          <Button
            variant="outlined"
            onClick={()=>navigate("/products")}
          >
            Xóa lọc
          </Button>

        </Stack>

      )}

      {/* SEARCH + SORT */}

      <Stack
        direction={{ xs:"column", md:"row" }}
        spacing={2}
        mb={4}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          background:"#fff",
          padding:"18px",
          borderRadius:"12px",
          boxShadow:"0 4px 12px rgba(0,0,0,0.05)"
        }}
      >

        <TextField
          size="small"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          sx={{
            width:{ xs:"100%", md:320 },
            background:"#f5f5f5",
            borderRadius:"8px"
          }}
          InputProps={{
            startAdornment:(
              <InputAdornment position="start">
                <SearchIcon/>
              </InputAdornment>
            )
          }}
        />

        <FormControl
          size="small"
          sx={{
            width:200,
            background:"#f5f5f5",
            borderRadius:"8px"
          }}
        >
          <InputLabel>Sắp xếp</InputLabel>

          <Select
            value={sortType}
            label="Sắp xếp"
            onChange={(e)=>setSortType(e.target.value)}
          >
            <MenuItem value="default">Mặc định</MenuItem>
            <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
            <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
          </Select>

        </FormControl>

      </Stack>

      {/* PRODUCT GRID */}

      <Box
        sx={{
          display:"grid",
          gridTemplateColumns:{
            xs:"repeat(2,1fr)",
            sm:"repeat(3,1fr)",
            md:"repeat(4,1fr)"
          },
          gap:3
        }}
      >

        {displayedProducts.map(item=>(

          <Card
            key={item.id}
            sx={{
              borderRadius:3,
              overflow:"hidden",
              background:"#fff",
              border:"1px solid #eee",
              position:"relative",
              transition:"all .3s",
              "&:hover":{
                transform:"translateY(-6px)",
                boxShadow:"0 12px 25px rgba(0,0,0,0.12)"
              }
            }}
          >

            {item.discount &&(

              <Chip
                label={`-${item.discount}%`}
                color="error"
                size="small"
                sx={{
                  position:"absolute",
                  top:10,
                  left:10,
                  fontWeight:"bold"
                }}
              />

            )}

            <IconButton
              sx={{
                position:"absolute",
                top:8,
                right:8,
                bgcolor:"#fff"
              }}
            >
              <FavoriteBorderIcon/>
            </IconButton>

            <Link to={`/product/${item.id}`}>

              <CardMedia
                component="img"
                image={item.img}
                onError={(e:any)=>{
                  e.target.src="https://via.placeholder.com/200"
                }}
                sx={{
                  height:200,
                  objectFit:"contain",
                  p:2
                }}
              />

            </Link>

            <CardContent>

              <Typography
                sx={{
                  fontSize:15,
                  fontWeight:500,
                  minHeight:40
                }}
              >
                {item.name}
              </Typography>

              <Rating
                value={item.rating || 4}
                readOnly
                size="small"
              />

              <Typography
                sx={{
                  fontSize:13,
                  color:"#666",
                  display:"flex",
                  alignItems:"center",
                  gap:0.5
                }}
              >
                <LocalFireDepartmentIcon
                  sx={{fontSize:16,color:"#ff6d00"}}
                />
                Đã bán {item.sold || 0}
              </Typography>

              <Typography
                sx={{
                  color:"#d70018",
                  fontWeight:700,
                  fontSize:18,
                  mt:1
                }}
              >
                {formatPrice(item.price)}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCartIcon/>}
                sx={{
                  mt:1.5,
                  backgroundColor:"#d70018",
                  textTransform:"none"
                }}
                onClick={()=>addToCart(item)}
              >
                Thêm vào giỏ
              </Button>

            </CardContent>

          </Card>

        ))}

      </Box>

      {/* PAGINATION */}

      <Box sx={{display:"flex",justifyContent:"center",mt:4}}>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(e,value)=>setPage(value)}
        />

      </Box>

      {/* ALERT */}

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={()=>setOpen(false)}
      >
        <Alert severity="success">
          Đã thêm sản phẩm vào giỏ hàng
        </Alert>
      </Snackbar>

    </Box>

  )

}

export default ProductList
