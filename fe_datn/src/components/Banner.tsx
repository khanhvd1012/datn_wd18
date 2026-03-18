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

// Dữ liệu sẽ được fetch từ API

const Banner = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [apiCategories, setApiCategories] = useState<{ name: string; _id: string }[]>([]);
  const [apiBanners, setApiBanners] = useState<{ image: string; title: string; _id: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch("http://localhost:3000/api/banners")
        ]);
        const cats = await catRes.json();
        const bans = await banRes.json();
        
        setApiCategories(Array.isArray(cats) ? cats : []);
        // Lọc banner đang hoạt động
        setApiBanners(Array.isArray(bans) ? bans.filter((b: any) => b.status !== false) : []);
      } catch (err) {
        console.error("Lỗi load banner/categories:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (hover || apiBanners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % apiBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [hover, apiBanners.length]);

  const next = () => {
    if (apiBanners.length === 0) return;
    setIndex((prev) => (prev + 1) % apiBanners.length);
  };

  const prev = () => {
    if (apiBanners.length === 0) return;
    setIndex((prev) => (prev === 0 ? apiBanners.length - 1 : prev - 1));
  };

  const goCategory = (id: string) => {
    navigate(`/products?category=${id}`);
  };

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

            {apiCategories.map((item, i) => (
              <ListItemButton
                key={i}
                onClick={() => goCategory(item._id)}
                sx={{
                  borderBottom: "1px solid #f1f1f1",
                  transition: "0.25s",

                  "&:hover": {
                    background: "#fff0f1",
                    pl: 3
                  }
                }}
              >

                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500
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
              display: "flex",
              width: `${(apiBanners.length || 1) * 100}%`,
              transform: `translateX(-${index * 100}%)`,
              transition: "0.6s"
            }}
          >

            {apiBanners.map((banner, i) => (
              <Box
                key={i}
                component="img"
                src={banner.image}
                sx={{
                  width: "100%",
                  height: 380,
                  objectFit: "cover"
                }}
              />
            ))}

            {apiBanners.length === 0 && (
               <Box
               component="img"
               src={mainBanner4}
               sx={{
                 width: "100%",
                 height: 380,
                 objectFit: "cover"
               }}
             />
            )}

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

        {/* RIGHT ADS

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
          /> */}

        {/* </Box> */}

      </Box>

    </Box>
  );
};

export default Banner;