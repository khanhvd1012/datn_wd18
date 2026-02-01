    import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    InputBase,
    IconButton,
    Button
    } from "@mui/material";
    import SearchIcon from "@mui/icons-material/Search";
    import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
    import PhoneIcon from "@mui/icons-material/Phone";
    import { Link } from "react-router-dom";

    const Header = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#222" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Typography
            component={Link}
            to="/"
            sx={{
                color: "#ff9800",
                fontWeight: "bold",
                fontSize: 33,
                textDecoration: "none"
            }}
            >
            LOGO
            </Typography>

            {/* Search */}
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 3,
                px: 3,
                width: 600,
                mx : 4
            }}
            >
            <InputBase
                placeholder="Nhập mã hoặc tên sản phẩm cần tìm?"
                sx={{ flex: 1 }}
            />
            <IconButton>
                <SearchIcon />
            </IconButton>
            </Box>

            {/* Right */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon sx={{ color: "#ff9800" }} />
                <Typography fontSize={14}>0987.65.4321</Typography>
            </Box>

            <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ color: "#fff", borderColor: "#ff9800" }}
            >
                Đăng nhập
            </Button>

            <IconButton sx={{ color: "#ff9800" }}>
                <ShoppingCartIcon />
            </IconButton>
            </Box>
        </Toolbar>
        </AppBar>
    );
    };

    export default Header;
