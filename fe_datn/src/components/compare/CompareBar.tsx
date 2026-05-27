import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

const CompareBar = () => {
  const { count, maxItems, clearAll } = useCompare();

  if (count === 0) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1200,
        px: 2,
        py: 1.5,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 320,
        maxWidth: "90vw",
        border: "1px solid #e0e0e0",
      }}
    >
      <CompareArrowsIcon color="primary" />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={700}>
          Đang so sánh {count}/{maxItems} sản phẩm
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Chỉ so sánh trong cùng danh mục
        </Typography>
      </Box>
      <Button
        component={Link}
        to="/compare"
        variant="contained"
        size="small"
        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
      >
        Xem so sánh
      </Button>
      <IconButton size="small" onClick={clearAll} aria-label="Xóa danh sách so sánh">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default CompareBar;
