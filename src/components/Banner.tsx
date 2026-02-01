    import { Box, List, ListItemButton, ListItemText } from "@mui/material";

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
            src="/banner-main.png"
            alt="banner"
            style={{ width: "100%", borderRadius: 6 }}
            />
        </Box>

        {/* Right banners */}
        <Box sx={{ width: 260, display: "flex", flexDirection: "column", gap: 2 }}>
            <img src="/banner-1.png" style={{ width: "100%" }} />
            <img src="/banner-2.png" style={{ width: "100%" }} />
        </Box>
        </Box>
    );
    };

    export default Banner;
