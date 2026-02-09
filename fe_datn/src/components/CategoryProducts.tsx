// import React from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   List,
//   ListItemButton,
//   ListItemText,
//   Divider,
//   Checkbox,
//   Breadcrumbs,
//   Link,
// } from "@mui/material";
// import Footer from "./Footer";
// const categories = [
//   {
//     title: "Phụ kiện Iphone",
//     children: ["Iphone XS", "Iphone 11", "Iphone 12", "Iphone 14", "Iphone 15"]
//   },
//   {
//     title: "Phụ kiện Samsung",
//     children: ["Samsung s22", "Samsung s23", "Samsung s24"]
//   },
//   {
//     title: "Phụ kiện Huawei",
//     children: ["Huawei 3", "Huawei 4"]
//   },
//   {
//     title: "Phụ kiện Xiaomi",
//     children: ["Xiaomi 10", "Xiaomi 12", "Xiaomi 13"]
//   },
//   {
//     title: "Phụ kiện Oppo",
//     children: ["Oppo A5", "Oppo A7", "Oppo A9"]
//   },
//   {
//     title: "Tai nghe Bluetooth",
//     children: ["AirPods", "Sony", "JBL"]
//   },
//   {
//     title: "Đồng hồ thông minh",
//     children: ["Apple Watch", "Samsung Watch", "Xiaomi Watch"]
//   }
// ];

// const CategoryProducts = () => {
    
//   return (
//     <Box sx={{ backgroundColor: "#111", minHeight: "100vh", p: 2 }}>
//       <Grid container spacing={2}>
//         {/* Sidebar */}
//         <Grid item xs={12} md={3}>
//                   <Box
//                     sx={{
//                       width: "100%",
//                         backgroundColor: "#101011",
//                         color: "#fff",
//                     }}
//                   >
//                     <Box sx={{ backgroundColor: "#ff9800", p: 1, fontWeight: "bold" }}>
//                       DANH MỤC SẢN PHẨM
//                     </Box>
          
//                     <List sx={{ p: 0 }}>
//                       {categories.map((cat, idx) => (
//                         <Box
//                           key={idx}
//                           sx={{
//                             position: "relative",
//                             "&:hover .submenu": {
//                               display: "block"
//                             }
//                           }}
//                         >
//                           {/* Menuchaa */}
//                           <ListItemButton
//                             component={Link}
//                             href="#"
//                             sx={{
//                               borderBottom: "1px solid #1e1e1e",
//                               textDecoration: "none",
//                               color: "#fff",
//                               "&:hover": { backgroundColor: "#1c1c1c" }
//                             }}
//                           >
//                             <ListItemText primary={cat.title} />
//                           </ListItemButton>
          
//                           {/* Sub mmenu */}
//                           <Box
//                             className="submenu"
//                             sx={{
//                               display: "none",
//                               position: "absolute",
//                               top: 0,
//                               left: "100%",
//                               width: 300,
//                               borderRadius: 1.6,
//                               backgroundColor: "#1b1b1b",
//                               boxShadow: "0 0 10px rgba(0,0,0,0.6)",
//                               zIndex: 10
//                             }}
//                           >
//                             {cat.children.map((item, i) => (
//                               <Box
//                                 key={i}
//                                 component={Link}
//                                 href="#"
//                                 sx={{
//                                   display: "block",
//                                   px: 2,
//                                   py: 1,
//                                   textDecoration: "none",
//                                   color: "#fff",
//                                   "&:hover": {
//                                     backgroundColor: "#ff9800",
//                                     color: "#000",
//                                     borderRadius: "4px"
//                                   }
//                                 }}
//                               >
//                                 {item}
//                               </Box>
//                             ))}
//                           </Box>
//                         </Box>
//                       ))}
//                     </List>
//                   </Box>
//         </Grid>

//         {/* ===== CONTENT RIGHT ===== */}
//             <Grid
//             item
//             xs={12}
//             md={9}
//             sx={{ display: "flex", alignItems: "flex-start" ,width: 990}}
//             >
//             <Box
//                 sx={{
//                 backgroundColor: "#1a1a1a",
//                 borderRadius: 2,
//                 p: 3,
//                 ml: 1.5,
//                 width: "100%",
//                 color: "#ddd",
//                 }}
//             >
//                 {/* ===== TEXT CONTENT ===== */}
//                 <Breadcrumbs sx={{ mb: 1 }}>
//                 <Link underline="hover" color="#aaa" href="/">
//                     Trang chủ
//                 </Link>
//                 <Link underline="hover" color="#aaa" href="/">
//                     Phụ kiện
//                 </Link>
//                 <Typography color="#ff9800">Iphone XS</Typography>
//                 </Breadcrumbs>

//                 <Typography
//                 variant="h5"
//                 sx={{ color: "#ff9800", fontWeight: 700, mb: 1 }}
//                 >
//                 Iphone XS
//                 </Typography>

//                 <Divider sx={{ backgroundColor: "#ff9800", mb: 2 }} />

//                 <Typography sx={{ mb: 1 }}>
//                 Cung cấp phụ kiện Iphone XS chính hãng - uy tín - giá tốt nhất hiện nay:
//                 </Typography>

//                 <Box
//                 component="ul"
//                 sx={{
//                     pl: 2,
//                     mt: 1,
//                     color: "#ccc",
//                     listStylePosition: "inside",
//                 }}
//                 >
//                 <li>Ốp lưng Iphone XS đẹp mỏng xịn</li>
//                 <li>Bao da Iphone XS chính hãng giá rẻ</li>
//                 <li>Dán màn hình - kính cường lực tốt nhất</li>
//                 <li>Phụ kiện chính hãng: bộ sạc, tai nghe zin, cáp sạc chuẩn…</li>
//                 </Box>

//                 <Typography sx={{ mt: 2, color: "#aaa" }}>
//                 Cam kết chất lượng và giá thấp nhất. Bảo hành hợp lý.  
//                 Ship COD toàn quốc: Hà Nội, TP.HCM, Hải Phòng, Đà Nẵng,...
//                 </Typography>

//                 {/* ===== SECTION ===== */}
//                 <Box
//                 sx={{
//                     mt: 4,
//                     mb: 2,
//                     border: "1px solid #2a2a2a",
//                     backgroundColor: "#151515",
//                     p: 1,   
//                 }}
//                 >
//                 <Box
//                     sx={{
//                     display: "inline-block",
//                     backgroundColor: "#ff6a00",
//                     color: "#fff",
//                     px: 4,
//                     py: 1,
//                     fontWeight: "bold",
//                     clipPath:
//                         "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)",
//                     }}
//                 >
//                     PHỤ KIỆN NỔI BẬT
//                 </Box>
//                 </Box>

//                 {/* ===== PRODUCT GRID ===== */}
//                 <Grid container spacing={2}>
//             {/* Product 1 */}
//             <Grid item xs={12} sm={6} md={3}>
//                 <Box
//                 sx={{
//                     backgroundColor: "#1a1a1a",
//                     border: "1px solid #2a2a2a",
//                     height: 400,
//                 }}
//                 >
//                 <Box
//                     component="img"
//                     src="https://cdn.tgdd.vn/Products/Images/54/307598/kinh-cuong-luc-iphone-15-pro-max.jpg"
//                     sx={{
//                     height: 220,
//                     width: 200,
//                     objectFit: "contain",
//                     backgroundColor: "#fff",
//                     p: 1,
//                     }}
//                 />
//                 <Box sx={{ p: 1.5 }}>
//                     <Typography variant="body2" sx={{ color: "#eee", minHeight: 48 }}>
//                     Dán kính cường lực iPhone 15 Pro Max
//                     </Typography>
//                     <Typography sx={{ color: "#ff3b3b", fontWeight: "bold" }}>
//                     100.000 đ
//                     </Typography>
//                 </Box>
//                 </Box>
//             </Grid>

//             {/* Product 2 */}
//             <Grid item xs={12} sm={6} md={3}>
//                 <Box sx={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", height: 400 }}>
//                 <Box
//                     component="img"
//                     src="https://cdn.tgdd.vn/Products/Images/54/311234/ppf-iphone-15.jpg"
//                     sx={{
//                     height: 220,
//                     width: 200,
//                     objectFit: "contain",
//                     backgroundColor: "#fff",
//                     p: 1,
//                     }}
//                 />
//                 <Box sx={{ p: 1.5 }}>
//                     <Typography variant="body2" sx={{ color: "#eee", minHeight: 48 }}>
//                     Dán PPF full màn hình iPhone 15
//                     </Typography>
//                     <Typography sx={{ color: "#ff3b3b", fontWeight: "bold" }}>
//                     120.000 đ
//                     </Typography>
//                 </Box>
//                 </Box>
//             </Grid>

//             {/* Product 3 */}
//             <Grid item xs={12} sm={6} md={3}>
//                 <Box sx={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", height: 400 }}>
//                 <Box
//                     component="img"
//                     src="https://cdn.tgdd.vn/Products/Images/60/295611/op-lung-iphone-15.jpg"
//                     sx={{
//                     height: 220,
//                     width: 200,
//                     objectFit: "contain",
//                     backgroundColor: "#fff",
//                     p: 1,
//                     }}
//                 />
//                 <Box sx={{ p: 1.5 }}>
//                     <Typography variant="body2" sx={{ color: "#eee", minHeight: 48 }}>
//                     Ốp lưng iPhone 15 chống sốc
//                     </Typography>
//                     <Typography sx={{ color: "#ff3b3b", fontWeight: "bold" }}>
//                     150.000 đ
//                     </Typography>
//                 </Box>
//                 </Box>
//             </Grid>

//             </Grid>

//             </Box>
//             </Grid>


//       </Grid>
//       <Footer />
//     </Box>
    
//   );
// };

// export default CategoryProducts;
