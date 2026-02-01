    import { Box, List, ListItemButton, ListItemText } from "@mui/material";
    import mainBanner0 from "../img/vi-vn-iphone-16-pro-1.jpg";
    import mainBanner1 from "../img/dien-thoai-iphone-16-pro-1.webp";
    import mainBanner2 from "../img/ban-phu-kien-dien-thoai-co-lai-khong.jpg";
    import mainBanner3 from "../img/mau-content-phu-kien-dien-thoai-4.png";
    const categories = [
    "Phụ kiện Iphone",
    "Phụ kiện Samsung",
    "Phụ kiện Huawei",
    "Phụ kiện Xiaomi",
    "Phụ kiện Oppo",
    "Tai nghe Bluetooth",
    "Đồng hồ thông minh"
    ];

    const Banner = () => {
    return (
        <div style={{ background:"#26262e" }}>
            <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
        {/* Sidebar */}
        <Box
            sx={{
            width: 250,
            backgroundColor: "#101011",
            color: "#fff"
            }}
        >
            <Box sx={{ backgroundColor: "#ff9800", p: 1, fontWeight: "bold" }}>
            DANH MỤC SẢN PHẨM
            </Box>
            <List>
            {categories.map((item, index) => (
                <ListItemButton key={index}>
                <ListItemText primary={item} />
                </ListItemButton>
            ))}
            </List>
        </Box>

        {/* Main banner */}
        <Box sx={{ flex: 1 }}>
            <img
            src={mainBanner0}
            alt="banner"
            style={{ width: "100%", borderRadius: 7,height:"370px" }}
            />
        </Box>

        {/* Right banners */}
        <Box sx={{ width: 260, display: "flex", flexDirection: "column", gap: 2 }}>
            <img src={mainBanner1} style={{ width: "100%" ,height:"178px",objectFit:"cover"}} />
            <img src={mainBanner2} style={{ width: "100%" ,height:"175px",objectFit:"cover"}} />
        </Box>
        </Box>
        </div>
    );
    };

    export default Banner;
