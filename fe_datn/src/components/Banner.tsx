import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import mainBanner4 from "../img/ban-phu-kien-dien-thoai-co-lai-khong.jpg";
import mainBanner6 from "../img/a93517d958abd6f58fba.jpg";
import mainBanner7 from "../img/5f096f672215ac4bf504.jpg";
import mainBanner9 from "../img/bl2.jpg";
import mainBanner10 from "../img/bl3.jpg";

const categories = [
  { name: "Phụ kiện Iphone", slug: "iphone" },
  { name: "Phụ kiện Samsung", slug: "samsung" },
  { name: "Phụ kiện Huawei", slug: "huawei" },
  { name: "Phụ kiện Xiaomi", slug: "xiaomi" },
  { name: "Phụ kiện Oppo", slug: "oppo" },
  { name: "Tai nghe Bluetooth", slug: "tainghe" },
  { name: "Đồng hồ thông minh", slug: "dongho" }
];

const banners = [mainBanner4, mainBanner10, mainBanner9];

const Banner = () => {

  const navigate = useNavigate();
  const [index,setIndex] = useState(0);
  const [hover,setHover] = useState(false);

  useEffect(()=>{

    if(hover) return;

    const timer = setInterval(()=>{
      setIndex(prev => (prev + 1) % banners.length);
    },4000);

    return ()=>clearInterval(timer);

  },[hover]);

  const next = ()=>{
    setIndex(prev => (prev + 1) % banners.length);
  }

  const prev = ()=>{
    setIndex(prev => prev === 0 ? banners.length - 1 : prev - 1);
  }

  const goCategory = (slug)=>{
    navigate(`/products?category=${slug}`);
  }

  return (

    <Box sx={{ mt:3 }}>

      <Box
        sx={{
          display:"flex",
          gap:2,
          maxWidth:1200,
          mx:"auto"
        }}
      >

        {/* SIDEBAR */}

        <Box
          sx={{
            width:230,
            bgcolor:"#fff",
            borderRadius:3,
            boxShadow:"0 4px 16px rgba(0,0,0,0.06)"
          }}
        >

          <Box
            sx={{
              bgcolor:"#d70018",
              color:"#fff",
              fontWeight:700,
              p:1.5,
              borderTopLeftRadius:12,
              borderTopRightRadius:12
            }}
          >
            DANH MỤC
          </Box>

          <List sx={{p:0}}>

            {categories.map((item,i)=>(
              <ListItemButton
                key={i}
                onClick={()=>goCategory(item.slug)}
                sx={{
                  borderBottom:"1px solid #f1f1f1",
                  transition:"0.25s",

                  "&:hover":{
                    background:"#fff0f1",
                    pl:3
                  }
                }}
              >

                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize:14,
                    fontWeight:500
                  }}
                />

              </ListItemButton>
            ))}

          </List>

        </Box>

        {/* MAIN SLIDER */}

        <Box
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          sx={{
            flex:1,
            height:380,
            borderRadius:3,
            overflow:"hidden",
            position:"relative",
            boxShadow:"0 8px 24px rgba(0,0,0,0.1)"
          }}
        >

          <Box
            sx={{
              display:"flex",
              width:`${banners.length*100}%`,
              transform:`translateX(-${index*100}%)`,
              transition:"0.6s"
            }}
          >

            {banners.map((img,i)=>(
              <Box
                key={i}
                component="img"
                src={img}
                sx={{
                  width:"100%",
                  height:380,
                  objectFit:"cover"
                }}
              />
            ))}

          </Box>

          <IconButton
            onClick={prev}
            sx={{
              position:"absolute",
              top:"50%",
              left:10,
              transform:"translateY(-50%)",
              bgcolor:"rgba(0,0,0,0.4)",
              color:"#fff"
            }}
          >
            <ArrowBackIosNewIcon/>
          </IconButton>

          <IconButton
            onClick={next}
            sx={{
              position:"absolute",
              top:"50%",
              right:10,
              transform:"translateY(-50%)",
              bgcolor:"rgba(0,0,0,0.4)",
              color:"#fff"
            }}
          >
            <ArrowForwardIosIcon/>
          </IconButton>

        </Box>

        {/* RIGHT ADS */}

        <Box
          sx={{
            width:250,
            display:"flex",
            flexDirection:"column",
            gap:2
          }}
        >

          <Box
            component="img"
            src={mainBanner7}
            sx={{
              width:"100%",
              height:180,
              borderRadius:3,
              objectFit:"cover",
              transition:"0.3s",

              "&:hover":{
                transform:"scale(1.05)"
              }
            }}
          />

          <Box
            component="img"
            src={mainBanner6}
            sx={{
              width:"100%",
              height:180,
              borderRadius:3,
              objectFit:"cover",
              transition:"0.3s",

              "&:hover":{
                transform:"scale(1.05)"
              }
            }}
          />

        </Box>

      </Box>

    </Box>
  );
};

export default Banner;