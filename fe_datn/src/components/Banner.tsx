
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
              display:"flex",
              width:`${banners.length * 700}px`,
              transform:`translateX(-${index * 700}px)`,
              transition:"transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >

            {banners.map((img,i)=>(
              <Box
                key={i}
                component="img"
                src={img}
                sx={{
                  width:"700px",
                  height:"400px",
                  objectFit:"auto",
                  flexShrink:0
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