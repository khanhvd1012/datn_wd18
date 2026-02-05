import { Box, Typography, TextField, Button, Stack, Link } from "@mui/material"

const NotFound = () => {
  return (
    <Box
      sx={{
        height: "max-height",
        width: "max-width",
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFDn89SPZb8JO3NeJCtADjToLEhMsgnAAUYA&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* Overlay tối */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(16, 15, 15, 0.65)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        {/* 404 */}
        <Typography
          sx={{
            fontSize: { xs: 90, md: 150 },
            fontWeight: 800,
            letterSpacing: 10,
          }}
        >
          <Box component="span" sx={{ color: "#fff" }}>
            4
          </Box>
          <Box component="span" sx={{ color: "#ffb400", mx: 1 }}>
            0
          </Box>
          <Box component="span" sx={{ color: "#fff" }}>
            4
          </Box>
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Rất tiếc! Không thể tìm thấy trang bạn đang tìm kiếm
        </Typography>

        <Typography
          sx={{
            maxWidth: 600,
            color: "#ccc",
            fontSize: 14,
            mb: 4,
          }}
        >
          Bạn đã nhấp vào một liên kết không thể tìm thấy.
          Vui lòng kiểm tra URL hoặc truy cập trang chính.
        </Typography>

        {/* Search */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%", maxWidth: 500 }}
        >
          <TextField
            placeholder="Nhập cụm từ tìm kiếm của bạn..."
            fullWidth
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 50,
                "& fieldset": {
                  borderColor: "#ffb400",
                },
                "&:hover fieldset": {
                  borderColor: "#ffb400",
                },
              },
            }}
          />

          <Button
            variant="contained"
            sx={{
              borderRadius: 50,
              px: 4,
              backgroundColor: "#ffb400",
              color: "#000",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#e0a800",
              },
            }}
          >
            Tìm kiếm
          </Button>
        </Stack>

        {/* Menu */}
        <Stack direction="row" spacing={3} sx={{ mt: 5 }}>
          {["Home", "About", "Blog", "Contact"].map((item) => (
            <Link
              key={item}
              href="/"
              underline="none"
              sx={{
                color: "#fff",
                fontSize: 14,
                "&:hover": { color: "#ffb400" },
              }}
            >
              {item}
            </Link>
          ))}
        </Stack>

        {/* Footer */}
        <Typography
          sx={{
            mt: 4,
            fontSize: 12,
            color: "#aaa",
          }}
        >
          
          © 2024 Error page
        </Typography>
      </Box>
    </Box>
  )
}

export default NotFound
