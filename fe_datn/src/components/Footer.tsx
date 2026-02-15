import { Box, Grid, Typography, Divider } from "@mui/material";
const iconStyle = {
  width: 28,
  height: 28,
  border: "1px solid #444",
  color: "#ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#ff9800",
    color: "#000"
  }
};

const Footer = () => {
  return (
    <>
      {/* ===== FOOTER TOP ===== */}
      <Box
        sx={{
          backgroundColor: "#1e1e1e",
          color: "#ccc",
          mt: 6 
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 4 }, py: 5 }}>
          <Grid container justifyContent="space-between" spacing={3}>
            {/* Cột 1 */}
            <Grid item xs={12} md={3}>
              <Typography color="#fff" fontWeight="bold" mb={1}>
                TÌM CHÚNG TÔI TRÊN FACEBOOK
              </Typography>
              <Divider sx={{ width: 40, height: 3, bgcolor: "#ff9800", mb: 2 }} />
              <Typography fontSize={14}>Phukiendienthoai</Typography>
            </Grid>

            {/* Cột 2 */}
            <Grid item xs={12} md={4}>
              <Typography color="#fff" fontWeight="bold" mb={1}>
                CHÍNH SÁCH & QUY ĐỊNH
              </Typography>
              <Divider sx={{ width: 40, height: 3, bgcolor: "#ff9800", mb: 2 }} />

              {[
                "Hướng dẫn mua online",
                "Cam kết bán hàng",
                "Bảo hành, đổi trả",
                "Chính sách bảo mật",
                "Chính sách với người tiêu dùng",
                "Chính sách giao hàng",
                "Kênh thông tin RSS"
              ].map((item, i) => (
                <Typography
                  key={i}
                  fontSize={14}
                  mb={0.8}
                  sx={{ "&:hover": { color: "#ff9800", cursor: "pointer" } }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Cột 3 */}
            <Grid item xs={12} md={3}>
              <Typography color="#fff" fontWeight="bold" mb={1}>
                LIÊN HỆ
              </Typography>
              <Divider sx={{ width: 40, height: 3, bgcolor: "#ff9800", mb: 2 }} />

              <Typography fontSize={14} mb={1}>
                Cơ sở 1: Số 24 - Ngõ 70 Thái Hà - Đống Đa - Hà Nội
              </Typography>
              <Typography fontSize={14} mb={1}>
                Email: lienhe@phukiendienthoai.com
              </Typography>

              <Typography color="#fff" fontWeight="bold" mt={2} mb={1}>
                CÓ THẮC MẮC?
              </Typography>

              <Typography fontSize={14}>📞 0987 65 4321</Typography>
              <Typography fontSize={14}>📞 0987 65 1234</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ===== FOOTER BOTTOM ===== */}
      <Box
        sx={{
          backgroundColor: "#181818",
          borderTop: "1px solid #333"
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 3, md: 4 },
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          {/* Left text */}
          <Box sx={{ textAlign: "left" }}>
            <Typography fontSize={13} mb={0.5}>
              Copyright © 2014 - 2026 by{" "}
              <span style={{ color: "#ff9800" }}>www.phukiendienthoai.com</span>
            </Typography>

            <Typography fontSize={13} mb={0.5}>
              Cơ quan chủ quản:{" "}
              <span style={{ color: "#ff9800" }}>
                Công ty cổ phần kỹ nghệ và thương mại Nhật Minh
              </span>
            </Typography>

            <Typography fontSize={13} mb={0.5}>
              GPKD: số 0105275227 do Sở kế hoạch và Đầu tư TP Hà Nội cấp ngày
              25/04/2011
            </Typography>

            <Typography fontSize={13}>Thiết kế web: Tuan Lak</Typography>
          </Box>

          {/* Right */}
          <Box sx={{ textAlign: "right" }}>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Box sx={iconStyle}>f</Box>
              <Box sx={iconStyle}>G+</Box>
              <Box sx={iconStyle}>🐦</Box>
              <Box sx={iconStyle}>▶</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
