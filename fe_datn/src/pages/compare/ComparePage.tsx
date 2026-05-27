import { useMemo } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SpeedIcon from "@mui/icons-material/Speed";
import { Link, useNavigate } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { getAttributeLabel } from "../../utils/compareProduct";
import {
  buildPerformanceRows,
  buildPerformanceValues,
  getAppearanceAttributes,
  getBestPerformanceIndex,
  getPerformanceBarPercent,
} from "../../utils/comparePerformance";
import { addToCartApi } from "../../services/cartService";
import type { CompareItem } from "../../types/compare";

const formatPrice = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";

type CompareRow = {
  label: string;
  get: (p: CompareItem) => React.ReactNode;
  highlight?: "min" | "max";
};

const ComparePage = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearAll, categoryName } = useCompare();

  const enrichedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        performance:
          item.performance ??
          buildPerformanceValues(
            item.categoryName,
            { ...item.attributes, ...(item as CompareItem & { performance?: never }) },
            item.name,
          ),
      })),
    [items],
  );

  const appearanceKeys = useMemo(() => {
    const keys = new Set<string>();
    enrichedItems.forEach((item) => {
      Object.keys(getAppearanceAttributes(item.attributes || {})).forEach((k) =>
        keys.add(k),
      );
    });
    return Array.from(keys);
  }, [enrichedItems]);

  const basicRows: CompareRow[] = useMemo(
    () => [
      { label: "Thương hiệu", get: (p) => p.brandName || "—" },
      {
        label: "Giá bán",
        get: (p) => formatPrice(p.price),
        highlight: "min",
      },
      {
        label: "Giá gốc",
        get: (p) => (p.original_price ? formatPrice(p.original_price) : "—"),
      },
      {
        label: "Tồn kho",
        get: (p) => (p.stock > 0 ? `${p.stock} sp` : "Hết hàng"),
        highlight: "max",
      },
      {
        label: "Đánh giá",
        get: (p) => (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
            <Rating value={p.rating || 0} readOnly size="small" precision={0.5} />
            <Typography variant="caption">({p.reviewCount})</Typography>
          </Box>
        ),
        highlight: "max",
      },
      ...appearanceKeys.map((key) => ({
        label: getAttributeLabel(key),
        get: (p: CompareItem) => p.attributes?.[key] || "—",
      })),
    ],
    [appearanceKeys],
  );

  const performanceRows = useMemo(
    () =>
      buildPerformanceRows(
        categoryName || enrichedItems[0]?.categoryName || "",
        enrichedItems.map((i) => ({
          attributes: i.attributes || {},
          name: i.name,
        })),
      ),
    [categoryName, enrichedItems],
  );

  const getBasicBestIndex = (row: CompareRow) => {
    if (!row.highlight || enrichedItems.length < 2) return -1;
    if (row.highlight === "min" && row.label === "Giá bán") {
      const prices = enrichedItems.map((i) => i.price);
      return prices.indexOf(Math.min(...prices));
    }
    if (row.highlight === "max" && row.label === "Tồn kho") {
      const stocks = enrichedItems.map((i) => i.stock);
      return stocks.indexOf(Math.max(...stocks));
    }
    if (row.highlight === "max" && row.label === "Đánh giá") {
      const ratings = enrichedItems.map((i) => i.rating || 0);
      return ratings.indexOf(Math.max(...ratings));
    }
    return -1;
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartApi({ product_id: productId, quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Đã thêm vào giỏ hàng");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const renderProductHeaders = () =>
    enrichedItems.map((item) => (
      <TableCell key={item._id} align="center" sx={{ minWidth: 240, bgcolor: "#fafafa", verticalAlign: "top" }}>
        <Box sx={{ position: "relative", py: 1 }}>
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => removeItem(item._id)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{ width: 130, height: 130, objectFit: "contain", mb: 1.5, mx: "auto", display: "block" }}
          />
          <Typography fontWeight={700} sx={{ mb: 1.5, px: 1, minHeight: 48 }}>
            {item.name}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
            <Button
              size="small"
              variant="outlined"
              component={Link}
              to={`/product/${item._id}`}
              sx={{ textTransform: "none" }}
            >
              Chi tiết
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => handleAddToCart(item._id)}
              disabled={item.stock <= 0}
              sx={{ textTransform: "none" }}
            >
              Mua
            </Button>
          </Box>
        </Box>
      </TableCell>
    ));

  const renderDataRows = (
    rows: CompareRow[],
    getBest: (row: CompareRow) => number,
  ) =>
    rows.map((row) => {
      const bestIdx = getBest(row);
      return (
        <TableRow key={row.label} hover>
          <TableCell sx={{ fontWeight: 600, bgcolor: "#fff" }}>{row.label}</TableCell>
          {enrichedItems.map((item, idx) => (
            <TableCell
              key={`${item._id}-${row.label}`}
              align="center"
              sx={{
                bgcolor: bestIdx === idx ? "rgba(46, 125, 50, 0.1)" : "#fff",
                fontWeight: bestIdx === idx ? 700 : 400,
              }}
            >
              {row.get(item)}
            </TableCell>
          ))}
        </TableRow>
      );
    });

  if (enrichedItems.length < 2) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          So sánh sản phẩm
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Hãy chọn ít nhất 2 sản phẩm cùng danh mục để so sánh (tối đa 3).
        </Typography>
        <Button variant="contained" onClick={() => navigate("/products")}>
          Chọn sản phẩm
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 14 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            So sánh sản phẩm
          </Typography>
          {categoryName && (
            <Chip label={categoryName} size="small" color="primary" sx={{ mt: 1 }} />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button variant="outlined" onClick={() => navigate("/products")} sx={{ textTransform: "none" }}>
            Thêm sản phẩm
          </Button>
          <Button variant="outlined" color="error" onClick={clearAll} sx={{ textTransform: "none" }}>
            Xóa tất cả
          </Button>
        </Box>
      </Box>

      {/* Bảng thông tin cơ bản */}
      <Paper sx={{ overflowX: "auto", borderRadius: 3, border: "1px solid #eee", mb: 3 }}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#f5f5f5", borderBottom: "1px solid #eee" }}>
          <Typography fontWeight={700}>Thông tin cơ bản</Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, minWidth: 160, bgcolor: "#fafafa" }}>Tiêu chí</TableCell>
              {renderProductHeaders()}
            </TableRow>
          </TableHead>
          <TableBody>{renderDataRows(basicRows, getBasicBestIndex)}</TableBody>
        </Table>
      </Paper>

      {/* Bảng so sánh hiệu năng */}
      <Paper sx={{ overflowX: "auto", borderRadius: 3, border: "1px solid #eee" }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "primary.main",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SpeedIcon fontSize="small" />
          <Typography fontWeight={700}>So sánh hiệu năng</Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, minWidth: 180, bgcolor: "#f0f7ff" }}>Tiêu chí</TableCell>
              {enrichedItems.map((item) => (
                <TableCell key={`perf-${item._id}`} align="center" sx={{ bgcolor: "#f0f7ff", fontWeight: 600 }}>
                  {item.brandName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {performanceRows.map((row) => {
              const bestIdx = getBestPerformanceIndex(row);
              const hasBars = row.numericValues.some((n) => n != null && n > 0);
              return (
                <TableRow key={row.key} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                  {row.values.map((val, idx) => {
                    const num = row.numericValues[idx];
                    const barPct = hasBars
                      ? getPerformanceBarPercent(num, row.numericValues)
                      : 0;
                    return (
                      <TableCell
                        key={`${row.key}-${idx}`}
                        align="center"
                        sx={{
                          bgcolor: bestIdx === idx ? "rgba(25, 118, 210, 0.1)" : undefined,
                          fontWeight: bestIdx === idx ? 700 : 400,
                          verticalAlign: "middle",
                        }}
                      >
                        <Typography sx={{ mb: hasBars && num ? 1 : 0 }}>{val}</Typography>
                        {hasBars && num != null && num > 0 && (
                          <Box sx={{ maxWidth: 200, mx: "auto" }}>
                            <LinearProgress
                              variant="determinate"
                              value={barPct}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "#e3f2fd",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 4,
                                  bgcolor: bestIdx === idx ? "success.main" : "primary.main",
                                },
                              }}
                            />
                            {bestIdx === idx && (
                              <Typography variant="caption" color="success.main" fontWeight={700}>
                                Tốt nhất
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Divider />
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#fafafa" }}>
          <Typography variant="caption" color="text.secondary">
            Thanh xanh thể hiện mức hiệu năng tương đối trong nhóm so sánh. Dữ liệu lấy từ thuộc tính
            variant (capacity, power, connector...) hoặc tên sản phẩm (vd: 20000mAh, 22.5W).
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ComparePage;
