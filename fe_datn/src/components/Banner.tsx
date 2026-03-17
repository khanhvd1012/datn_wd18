
// import { 
//   Box, 
//   List, 
//   ListItemButton, 
//   ListItemText, 
//   IconButton 
// } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { useState, useEffect } from "react";
// import mainBanner4 from "../img/ban-phu-kien-dien-thoai-co-lai-khong.jpg";
// import mainBanner6 from "../img/a93517d958abd6f58fba.jpg";
// import mainBanner7 from "../img/5f096f672215ac4bf504.jpg";
// import mainBanner8 from "../img/bl1.jpeg";
// import mainBanner9 from "../img/bl2.jpg";
// import mainBanner10 from "../img/bl3.jpg";

// const categories = [
//   "Phụ kiện Iphone",
//   "Phụ kiện Samsung",
//   "Phụ kiện Huawei",
//   "Phụ kiện Xiaomi",
//   "Phụ kiện Oppo",
//   "Tai nghe Bluetooth",
//   "Đồng hồ thông minh"
// ];

// const banners = [mainBanner4, mainBanner10, mainBanner9];

// const Banner = () => {
//   const [index, setIndex] = useState(0);

//   // 👉 Auto slide
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % banners.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   const handleNext = () => {
//     setIndex((prev) => (prev + 1) % banners.length);
//   };

//   const handlePrev = () => {
//     setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
//   };

//   return (
//     <div style={{ background: "", borderBottom: "1px " }}>
//       <Box sx={{ display: "flex", mt: 2, gap: 2 }}>

//         {/* Sidebar */}
//         <Box sx={{ width: 250,height: "388px",borderBottomRightRadius:5, backgroundColor: "", color: "#000000" }}>
//           <Box sx={{ backgroundColor: "#ff9800", p: 1, fontWeight: "bold",}}>
//             DANH MỤC SẢN PHẨM
//           </Box>
//           <List>
//             {categories.map((item, index) => (
//               <ListItemButton key={index}>
//                 <ListItemText primary={item} />
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>

//         {/* Main banner slider */}
//         <Box
//           sx={{
//             width: "700px",
//             height: "385px",
//             overflow: "hidden",
//             borderRadius: 2, 
//             position: "relative",
//             backgroundColor: "#000",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               width: `${banners.length * 700}px`,
//               transform: `translateX(-${index * 700}px)`,
//               transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
//             }}
//           >
//             {banners.map((img, i) => (
//               <Box
//                 key={i}
//                 component="img"
//                 src={img}
//                 alt={`banner-${i}`}
//                 sx={{
//                   width: "700px",
//                   height: "400px",
//                   objectFit: "auto",
//                   flexShrink: 0,
//                 }}
//               />
//             ))}
//           </Box>

//           {/* Prev */}
//           <IconButton
//             onClick={handlePrev}
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: 10,
//               transform: "translateY(-50%)",
//               bgcolor: "rgba(0,0,0,0.4)",
//               color: "#fff",
//               "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
//             }}
//           >
//             <ArrowBackIosNewIcon />
//           </IconButton>

//           {/* Next */}
//           <IconButton
//             onClick={handleNext}
//             sx={{
//               position: "absolute",
//               top: "50%",
//               right: 10,
//               transform: "translateY(-50%)",
//               bgcolor: "rgba(0,0,0,0.4)",
//               color: "#fff",
//               "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
//             }}
//           >
//             <ArrowForwardIosIcon />
//           </IconButton>
//         </Box>

//         {/* Right banners */}
//         <Box sx={{ width: 260, display: "flex", flexDirection: "column", gap: 2 }}>
//             <img
//                 src={mainBanner7}
//                 style={{
//                 width: "100%",
//                 height: "178px",
//                 objectFit: "cover",
//                 borderRadius: 6,
//                 animation: "floatY 4s ease-in-out infinite",
//                 }}
//             />
//             <img
//                 src={mainBanner6}
//                 style={{
//                 width: "100%",
//                 height: "187px",
//                 objectFit: "cover",
//                 borderRadius: 6,
//                 animation: "floatY 4s ease-in-out infinite 1.5s",
//                 }}
//             />
//         </Box>


//       </Box>

//       {/* Animation */}
//       <style>
//         {`
//         @keyframes floatY {
//             0% { transform: translateY(0); }
//             25% { transform: translateY(0px); }
//             50% { transform: translateY(0); }
//             75% { transform: translateY(3px); }
//             100% { transform: translateY(0); }
//         }
//         `}
//         </style>

//     </div>
//   );
// };

// export default Banner;



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

    <Box sx={{ mt:2 }}>

      <Box
        sx={{
          display:"flex",
          gap:2,
          maxWidth:1200,
          mx:"auto"
        }}
      >

{/* Sidebar */}
<Box
  sx={{
    width: 250,
    height: "388px",
    borderBottomRightRadius: 5,
    backgroundColor: "",
    color: "#000000"
  }}
>
  <Box
    sx={{
      backgroundColor: "#ff9800",
      p: 1,
      fontWeight: "bold"
    }}
  >
    DANH MỤC SẢN PHẨM
  </Box>

<<<<<<< HEAD
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
=======
  <List>
    {categories.map((item, index) => (
      <ListItemButton
        key={index}
        onClick={() => goCategory(item.slug)}
      >
        <ListItemText primary={item.name} />
      </ListItemButton>
    ))}
  </List>
</Box>
>>>>>>> 0eec834b (bg w)

        {/* MAIN SLIDER */}

        <Box
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          sx={{
            width:"700px",
            height:"385px",
            overflow:"hidden",
            borderRadius:2,
            position:"relative",
            backgroundColor:"#000",
            display:"flex",
            alignItems:"center"
          }}
        >

            <Box
            sx={{
<<<<<<< HEAD
              display: "flex",
              width: `${(apiBanners.length || 1) * 100}%`,
              transform: `translateX(-${index * 100}%)`,
              transition: "0.6s"
=======
              display:"flex",
              width:`${banners.length * 700}px`,
              transform:`translateX(-${index * 700}px)`,
              transition:"transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
>>>>>>> 0eec834b (bg w)
            }}
          >

            {apiBanners.map((banner, i) => (
              <Box
                key={i}
                component="img"
                src={banner.image}
                sx={{
<<<<<<< HEAD
                  width: "100%",
                  height: 380,
                  objectFit: "cover"
=======
                  width:"700px",
                  height:"400px",
                  objectFit:"auto",
                  flexShrink:0
>>>>>>> 0eec834b (bg w)
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
              color:"#fff",
              "&:hover":{bgcolor:"rgba(0,0,0,0.6)"}
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
              color:"#fff",
              "&:hover":{bgcolor:"rgba(0,0,0,0.6)"}
            }}
          >
            <ArrowForwardIosIcon/>
          </IconButton>

        </Box>

        {/* RIGHT ADS */}

<Box
  sx={{
    width:260,
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
      height:"178px",
      objectFit:"cover",
      borderRadius:2,
      animation:"floatY 4s ease-in-out infinite"
    }}
  />

  <Box
    component="img"
    src={mainBanner6}
    sx={{
      width:"100%",
      height:"187px",
      objectFit:"cover",
      borderRadius:2,
      animation:"floatY 4s ease-in-out infinite 1.5s"
    }}
  />

</Box>

      </Box>
<style>
{`
@keyframes floatY {
 0% { transform: translateY(0); }
 25% { transform: translateY(0px); }
 50% { transform: translateY(0); }
 75% { transform: translateY(6px); }
 100% { transform: translateY(0); }
}
`}
</style>
    </Box>
  );
};

export default Banner;