import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Badge,
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  FilterList,
  MoreVert,
  Visibility,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Image,
  AttachMoney,
  Inventory,
  Category,
  BrandingWatermark,
  ExpandMore,
  AddCircle,
  RemoveCircle,
  ColorLens,
  Memory,
  Straighten,
  Close,
} from "@mui/icons-material";
import api from "../../services/api";

interface Variant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  original_price: number;
  countInStock: number;
  sold: number;
  color?: string;
  size?: string;
  storage?: string;
  material?: string;
  images: string[];
  is_active: boolean;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | { _id: string; name: string };
  category: string | { _id: string; name: string };
  price?: number;
  variants: Variant[];
  images: string[];
  rating: number;
  reviews: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  slug: string;
  images: string[];
  is_active: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface VariantFormData {
  name: string;
  sku: string;
  price: number;
  original_price: number;
  countInStock: number;
  color?: string;
  size?: string;
  storage?: string;
  material?: string;
  images: string[];
  is_active: boolean;
  is_default?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductVariantManagement: React.FC = () => {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [tabValue, setTabValue] = useState(0);
  const [expandedProduct, setExpandedProduct] = useState<string | false>(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info",
  ) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: 0,
    slug: "",
    images: [],
    is_active: true,
  });

  const [variantFormData, setVariantFormData] = useState<VariantFormData>({
    name: "",
    sku: "",
    price: 0,
    original_price: 0,
    countInStock: 0,
    color: "",
    size: "",
    storage: "",
    material: "",
    images: [],
    is_active: true,
    is_default: false,
  });

  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [variantImageFiles, setVariantImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [
    page,
    rowsPerPage,
    searchTerm,
    categoryFilter,
    brandFilter,
    statusFilter,
  ]);

  // Fetch categories and brands for dropdowns
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        console.log("🔄 Starting to fetch categories and brands...");

        const [categoriesRes, brandsRes] = await Promise.all([
          api.get("/categories"),
          api.get("/brands"),
        ]);

        console.log("✅ Categories API response:", categoriesRes);
        console.log("✅ Brands API response:", brandsRes);
        console.log("📊 Categories data:", categoriesRes.data);
        console.log("📊 Brands data:", brandsRes.data);

        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);

        console.log(
          "🎯 Categories set:",
          categoriesRes.data?.length || 0,
          "items",
        );
        console.log("🎯 Brands set:", brandsRes.data?.length || 0, "items");
      } catch (error) {
        console.error("❌ Error fetching categories and brands:", error);
        console.error(
          "❌ Error details:",
          error.response?.data || error.message,
        );
        setCategories([]);
        setBrands([]);
      }
    };

    fetchCategoriesAndBrands();
  }, []); // Empty dependency array - only run once

  // Helper functions to get brand and category names
  const getBrandName = (brand: string | { _id: string; name: string }) => {
    if (typeof brand === "string") {
      const matchedBrand = brands.find((b) => b._id === brand);
      return matchedBrand ? matchedBrand.name : brand;
    }
    return brand?.name || "";
  };

  const getCategoryName = (
    category: string | { _id: string; name: string },
  ) => {
    if (typeof category === "string") {
      const matchedCategory = categories.find((c) => c._id === category);
      return matchedCategory ? matchedCategory.name : category;
    }
    return category?.name || "";
  };

  // Generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .trim();
  };

  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter) params.append("category", categoryFilter);
      if (brandFilter) params.append("brand", brandFilter);
      params.append("page", (page + 1).toString());
      params.append("limit", rowsPerPage.toString());

      // Add cache-busting parameter when forcing refresh
      if (forceRefresh) {
        params.append("t", Date.now().toString());
      }

      // Fetch products from MongoDB
      const response = await api.get(`/products?${params.toString()}`);

      // Handle paginated response or direct array
      const productsData = response.data.data || response.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      const message =
        error.response?.data?.message || "Không thể tải dữ liệu sản phẩm";
      showNotification(message, "error");
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    product: Product,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleVariantMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    variant: Variant,
    product: Product,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedVariant(variant);
    setSelectedProduct(product);
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const response = await api.get(`/products/${product._id}`);
      const freshProduct = response.data || product;
      setSelectedProduct(freshProduct);
      setProductFormData({
        name: freshProduct.name,
        description: freshProduct.description,
        brand:
          typeof freshProduct.brand === "string"
            ? freshProduct.brand
            : freshProduct.brand?.name || "",
        category:
          typeof freshProduct.category === "string"
            ? freshProduct.category
            : freshProduct.category?.name || "",
        price: freshProduct.price || 0,
        slug: freshProduct.slug || generateSlug(freshProduct.name),
        images: freshProduct.images || [],
        is_active:
          freshProduct.is_active === true || freshProduct.is_active === false
            ? freshProduct.is_active
            : true,
      });
    } catch (error) {
      console.error("Error fetching product details for edit:", error);
      setSelectedProduct(product);
      setProductFormData({
        name: product.name,
        description: product.description,
        brand:
          typeof product.brand === "string" ? product.brand : product.brand?.name || "",
        category:
          typeof product.category === "string"
            ? product.category
            : product.category?.name || "",
        price: product.price || 0,
        slug: product.slug || generateSlug(product.name),
        images: product.images || [],
        is_active:
          product.is_active === true || product.is_active === false
            ? product.is_active
            : true,
      });
    }
    setProductImageFiles([]);
    setOpenProductDialog(true);
    setDialogMode("edit");
  };

  const handleEditVariant = async (variant: Variant, product: Product) => {
    setVariantImageFiles([]);
    console.log("🔧 Editing variant - raw data:", variant);
    try {
      const response = await api.get(`/variants/${variant._id}`);
      const freshVariant = response.data.variant || variant;
      setSelectedVariant(freshVariant);
      setSelectedProduct(product);
      setVariantFormData({
        name: freshVariant.name,
        sku: freshVariant.sku,
        price: freshVariant.price,
        original_price: freshVariant.original_price,
        countInStock: freshVariant.countInStock,
        color: freshVariant.color,
        size: freshVariant.size,
        storage: freshVariant.storage,
        material: freshVariant.material,
        images: freshVariant.images || [],
        is_active: freshVariant.is_active,
      });
    } catch (error) {
      console.error("Error fetching variant details for edit:", error);
      setSelectedVariant(variant);
      setSelectedProduct(product);
      setVariantFormData({
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        original_price: variant.original_price,
        countInStock: variant.countInStock,
        color: variant.color,
        size: variant.size,
        storage: variant.storage,
        material: variant.material,
        images: variant.images || [],
        is_active: variant.is_active,
      });
    }
    setDialogMode("edit");
    setOpenVariantDialog(true);
    handleMenuClose();
  };

  const handleCreateProduct = () => {
    setProductFormData({
      name: "",
      description: "",
      brand: "",
      category: "",
      price: 0,
      slug: "",
      images: [],
      is_active: true,
    });
    setProductImageFiles([]);
    setDialogMode("create");
    setOpenProductDialog(true);
  };

  const handleCreateVariant = (product: Product) => {
    setSelectedProduct(product);
    setVariantFormData({
      name: "",
      sku: "",
      price: 0,
      original_price: 0,
      countInStock: 0,
      color: "",
      size: "",
      storage: "",
      material: "",
      images: [],
      is_active: true,
    });
    setVariantImageFiles([]);
    setDialogMode("create");
    setOpenVariantDialog(true);
  };

  const handleRemoveProductImage = (index: number) => {
    setProductFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveVariantImage = (index: number) => {
    setVariantFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewProductImage = (index: number) => {
    setProductImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewVariantImage = (index: number) => {
    setVariantImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProductAccordionChange =
    (productId: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedProduct(isExpanded ? productId : false);
    };

  const handleSaveProduct = async () => {
    try {
      // Validate required fields
      if (!productFormData.name.trim()) {
        showNotification("Vui lòng nhập tên sản phẩm", "error");
        return;
      }

      if (!productFormData.price || productFormData.price <= 0) {
        showNotification("Vui lòng nhập giá sản phẩm lớn hơn 0", "error");
        return;
      }

      if (!productFormData.slug.trim()) {
        showNotification("Vui lòng nhập slug", "error");
        return;
      }

      // Convert brand and category names to IDs for API
      const selectedBrand = brands.find(
        (b) => b.name === productFormData.brand,
      );
      const selectedCategory = categories.find(
        (c) => c.name === productFormData.category,
      );

      const dataToSend = {
        ...productFormData,
        brand: selectedBrand?._id || productFormData.brand,
        category: selectedCategory?._id || productFormData.category,
      };

      console.log("📤 Sending data to API:", dataToSend);

      const formData = new FormData();
      
      // Append text fields
      formData.append("name", dataToSend.name);
      formData.append("description", dataToSend.description);
      formData.append("brand", dataToSend.brand);
      formData.append("category", dataToSend.category);
      formData.append("price", String(dataToSend.price));
      formData.append("slug", dataToSend.slug);
      formData.append("is_active", String(dataToSend.is_active));
      
      // Append current existing image URLs so backend can keep or delete
      formData.append("existingImages", JSON.stringify(productFormData.images || []));
      // Append new file uploads
      productImageFiles.forEach((file) => formData.append("images", file));

      let productResponse;
      if (dialogMode === "create") {
        productResponse = await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Tạo sản phẩm thành công", "success");
      } else if (dialogMode === "edit" && selectedProduct) {
        productResponse = await api.put(
          `/products/${selectedProduct._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        showNotification("Cập nhật sản phẩm thành công", "success");
      }

      await fetchProducts(true); // Always refresh from backend after create/update
      if (productResponse?.data?.product) {
        const returnedProduct = productResponse.data.product;
        setProductFormData((prev) => ({
          ...prev,
          ...returnedProduct,
          images: Array.isArray(returnedProduct.images) ? returnedProduct.images : [],
        }));
      }
      setOpenProductDialog(false);
      setProductImageFiles([]);
    } catch (error: any) {
      console.error("Error saving product:", error);
      const message = error.response?.data?.message || "Không thể lưu sản phẩm";
      showNotification(message, "error");
    }
  };

  const handleSaveVariant = async () => {
    console.log("🔧 Saving variant:", {
      dialogMode,
      selectedProduct,
      selectedVariant,
    });
    console.log("🔧 Form data:", variantFormData);

    if (!variantFormData.name || !variantFormData.price) {
      showNotification("Tên và giá biến thể là bắt buộc", "error");
      return;
    }

    const payload = {
      name: variantFormData.name,
      sku: variantFormData.sku,
      price: variantFormData.price,
      original_price: variantFormData.original_price,
      stock: variantFormData.countInStock,
      color: variantFormData.color,
      size: variantFormData.size,
      storage: variantFormData.storage,
      material: variantFormData.material,
      attributes: {
        color: variantFormData.color,
        size: variantFormData.size,
        storage: variantFormData.storage,
        material: variantFormData.material,
      },
      images: variantFormData.images,
      is_active: variantFormData.is_active,
      is_default: variantFormData.is_default,
    };

    console.log("🚀 Payload final:", payload);

    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "images") {
          // Skip images here, handle separately below
          return;
        }
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      
      // Append existing images as JSON string (single field, not multiple)
      if (Array.isArray(payload.images) && payload.images.length > 0) {
        formData.append("existingImages", JSON.stringify(payload.images));
      } else {
        formData.append("existingImages", JSON.stringify([]));
      }
      
      // Append new file uploads
      variantImageFiles.forEach((file) => formData.append("images", file));

      let response;
      if (dialogMode === "create" && selectedProduct) {
        formData.append("product", selectedProduct._id);
        response = await api.post("/variants", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Create response:", response.data);
        showNotification("Tạo biến thể thành công", "success");
      } else if (dialogMode === "edit" && selectedVariant) {
        response = await api.put(
          `/variants/${selectedVariant._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        console.log("✅ Update response:", response.data);
        showNotification("Cập nhật biến thể thành công", "success");
      } else {
        showNotification("Chưa chọn sản phẩm hoặc biến thể", "error");
        return;
      }

      await fetchProducts(true); // Always refresh after create/update variant
      setVariantImageFiles([]);
      setOpenVariantDialog(false);
    } catch (error: any) {
      console.error("Error saving variant:", error);
      const message = error.response?.data?.message || "Không thể lưu biến thể";
      showNotification(message, "error");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await api.delete(`/products/${product._id}`);
      showNotification("Xóa sản phẩm thành công", "success");
      handleMenuClose();
      fetchProducts(); // Refresh data
    } catch (error: any) {
      console.error("Error deleting product:", error);
      const message = error.response?.data?.message || "Không thể xóa sản phẩm";
      showNotification(message, "error");
    }
  };

  const handleDeleteVariant = async (variant: Variant, product: Product) => {
    try {
      await api.delete(`/variants/${variant._id}`);
      setProducts(
        products.map((p) =>
          p._id === product._id
            ? {
                ...p,
                variants: p.variants.filter((v) => v._id !== variant._id),
                updated_at: new Date().toISOString(),
              }
            : p,
        ),
      );
      showNotification("Xóa biến thể thành công", "success");
      handleMenuClose();
    } catch (error: any) {
      console.error("Error deleting variant:", error);
      const message = error.response?.data?.message || "Không thể xóa biến thể";
      showNotification(message, "error");
    }
  };

  const getTotalStock = (product: Product) => {
    return (product.variants || []).reduce(
      (total, variant) => total + variant.countInStock,
      0,
    );
  };

  const getTotalSold = (product: Product) => {
    return (product.variants || []).reduce(
      (total, variant) => total + variant.sold,
      0,
    );
  };

  const getMinPrice = (product: Product) => {
    const variants = product.variants || [];
    if (variants.length === 0) return 0;
    return Math.min(...variants.map((v) => v.price));
  };

  const getMaxPrice = (product: Product) => {
    const variants = product.variants || [];
    if (variants.length === 0) return 0;
    return Math.max(...variants.map((v) => v.price));
  };

  const filteredProducts = products.filter((product) => {
    const normalizedName = product.name?.toString().toLowerCase() || "";
    const normalizedDescription =
      product.description?.toString().toLowerCase() || "";
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !normalizedSearch ||
      normalizedName.includes(normalizedSearch) ||
      normalizedDescription.includes(normalizedSearch);

    const productCategoryId =
      typeof product.category === "string"
        ? product.category
        : product.category?._id || product.category?.id || "";
    const productCategoryName =
      typeof product.category === "string"
        ? product.category
        : product.category?.name || "";
    const productBrandId =
      typeof product.brand === "string"
        ? product.brand
        : product.brand?._id || product.brand?.id || "";
    const productBrandName =
      typeof product.brand === "string" ? product.brand : product.brand?.name || "";

    const selectedCategoryName =
      categories.find((c) => c._id === categoryFilter)?.name?.toLowerCase() || "";
    const selectedBrandName =
      brands.find((b) => b._id === brandFilter)?.name?.toLowerCase() || "";

    const matchesCategory =
      !categoryFilter ||
      productCategoryId === categoryFilter ||
      productCategoryName.toLowerCase() === categoryFilter.toLowerCase() ||
      (selectedCategoryName && productCategoryName.toLowerCase() === selectedCategoryName);

    const matchesBrand =
      !brandFilter ||
      productBrandId === brandFilter ||
      productBrandName.toLowerCase() === brandFilter.toLowerCase() ||
      (selectedBrandName && productBrandName.toLowerCase() === selectedBrandName);

    const productIsActive =
      product.is_active === true ||
      product.is_active === "active" ||
      product.is_active === "true" ||
      product.is_active === "1";

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && productIsActive) ||
      (statusFilter === "inactive" && !productIsActive);

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  const productStats = {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    inactive: products.filter((p) => !p.is_active).length,
    totalVariants: products.reduce(
      (sum, p) => sum + (p.variants?.length || 0),
      0,
    ),
    totalStock: products.reduce((sum, p) => sum + getTotalStock(p), 0),
    totalSold: products.reduce((sum, p) => sum + getTotalSold(p), 0),
  };

  return (
    <Box sx={{ p: 3, width: "100%", maxWidth: "none" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Quản lý sản phẩm & Biến thể
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateProduct}
          sx={{ borderRadius: 2 }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {productStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng sản phẩm
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {productStats.totalVariants}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng biến thể
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {productStats.totalStock.toLocaleString("vi-VN")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng tồn kho
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
          }}
        >
          <CardContent sx={{ p: 2, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {productStats.totalSold.toLocaleString("vi-VN")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã bán
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Danh mục"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Thương hiệu</InputLabel>
            <Select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              label="Thương hiệu"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ height: "56px" }}
          >
            Bộ lọc
          </Button>
        </Box>
      </Paper>

      {/* Products with Variants */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Thương hiệu</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Biến thể</TableCell>
                <TableCell>Kho hàng</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Đã bán</TableCell>
                <TableCell>Đánh giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <React.Fragment key={product._id}>
                  <TableRow hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            color: "primary.main",
                          }}
                        >
                          <ShoppingBag />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.slug}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getBrandName(product.brand)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryName(product.category)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        badgeContent={product.variants?.length || 0}
                        color="primary"
                      >
                        <Typography variant="body2">
                          {product.variants?.length || 0} biến thể
                        </Typography>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getTotalStock(product).toLocaleString("vi-VN")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getMinPrice(product).toLocaleString("vi-VN")} -{" "}
                        {getMaxPrice(product).toLocaleString("vi-VN")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getTotalSold(product).toLocaleString("vi-VN")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2">
                          ⭐ {product.rating}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({product.reviews})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          product.is_active ? "Hoạt động" : "Không hoạt động"
                        }
                        color={product.is_active ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, product)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Variants Row */}
                  <TableRow>
                    <TableCell colSpan={10} sx={{ p: 0, borderBottom: "none" }}>
                      <Accordion
                        expanded={expandedProduct === product._id}
                        onChange={handleProductAccordionChange(product._id)}
                        sx={{
                          boxShadow: "none",
                          "&:before": { display: "none" },
                          backgroundColor: alpha(
                            theme.palette.background.default,
                            0.5,
                          ),
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            Chi tiết biến thể ({product.variants?.length || 0})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ mb: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddCircle />}
                              onClick={() => handleCreateVariant(product)}
                              sx={{ mr: 2 }}
                            >
                              Thêm biến thể
                            </Button>
                          </Box>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Tên biến thể</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Thuộc tính</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Tồn kho</TableCell>
                                <TableCell>Đã bán</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(product.variants || []).map((variant) => (
                                <TableRow key={variant._id} hover>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {variant.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {variant.sku}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {variant.color && (
                                        <Chip
                                          label={variant.color}
                                          size="small"
                                          icon={<ColorLens fontSize="small" />}
                                        />
                                      )}
                                      {variant.storage && (
                                        <Chip
                                          label={variant.storage}
                                          size="small"
                                          icon={<Memory fontSize="small" />}
                                        />
                                      )}
                                      {variant.size && (
                                        <Chip
                                          label={variant.size}
                                          size="small"
                                          icon={<Straighten fontSize="small" />}
                                        />
                                      )}
                                      {variant.material && (
                                        <Chip
                                          label={variant.material}
                                          size="small"
                                        />
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {variant.price.toLocaleString("vi-VN")}
                                    </Typography>
                                    {variant.original_price > variant.price && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ textDecoration: "line-through" }}
                                      >
                                        {variant.original_price.toLocaleString(
                                          "vi-VN",
                                        )}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {variant.countInStock}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {variant.sold}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={
                                        variant.is_active
                                          ? "Hoạt động"
                                          : "Không hoạt động"
                                      }
                                      color={
                                        variant.is_active ? "success" : "error"
                                      }
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <IconButton
                                      onClick={(e) =>
                                        handleVariantMenuClick(
                                          e,
                                          variant,
                                          product,
                                        )
                                      }
                                      size="small"
                                    >
                                      <MoreVert fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </Paper>

      {/* Product Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && !selectedVariant}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem
          onClick={() => selectedProduct && handleEditProduct(selectedProduct)}
        >
          <Edit sx={{ mr: 1 }} /> Chỉnh sửa sản phẩm
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedProduct && handleCreateVariant(selectedProduct)
          }
        >
          <AddCircle sx={{ mr: 1 }} /> Thêm biến thể
        </MenuItem>
        <MenuItem>
          <Visibility sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedProduct && handleDeleteProduct(selectedProduct)
          }
        >
          <Delete sx={{ mr: 1 }} /> Xóa sản phẩm
        </MenuItem>
      </Menu>

      {/* Variant Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && !!selectedVariant}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem
          onClick={() =>
            selectedVariant &&
            selectedProduct &&
            handleEditVariant(selectedVariant, selectedProduct)
          }
        >
          <Edit sx={{ mr: 1 }} /> Chỉnh sửa biến thể
        </MenuItem>
        <MenuItem>
          <Visibility sx={{ mr: 1 }} /> Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedVariant &&
            selectedProduct &&
            handleDeleteVariant(selectedVariant, selectedProduct)
          }
        >
          <Delete sx={{ mr: 1 }} /> Xóa biến thể
        </MenuItem>
      </Menu>

      {/* Product Dialog */}
      <Dialog
        open={openProductDialog}
        onClose={() => setOpenProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              value={productFormData.name}
              onChange={(e) => {
                const name = e.target.value;
                setProductFormData({
                  ...productFormData,
                  name: name,
                  slug: generateSlug(name),
                });
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              value={productFormData.description}
              onChange={(e) =>
                setProductFormData({
                  ...productFormData,
                  description: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Slug (URL)"
              value={productFormData.slug}
              onChange={(e) =>
                setProductFormData({ ...productFormData, slug: e.target.value })
              }
              helperText="Đường dẫn URL thân thiện cho SEO"
            />
            <TextField
              fullWidth
              label="Giá cơ bản"
              type="number"
              value={productFormData.price}
              onChange={(e) =>
                setProductFormData({
                  ...productFormData,
                  price: Number(e.target.value),
                })
              }
              helperText="Giá mặc định cho sản phẩm"
            />
            <FormControl fullWidth>
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                value={productFormData.brand}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    brand: e.target.value,
                  })
                }
                label="Thương hiệu"
              >
                <MenuItem value="">Chọn thương hiệu</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={productFormData.category}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    category: e.target.value,
                  })
                }
                label="Danh mục"
              >
                <MenuItem value="">Chọn danh mục</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Hình ảnh sản phẩm
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="product-image-upload"
                multiple
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setProductImageFiles((prev) => [...prev, ...Array.from(e.target.files)]);
                  }
                }}
              />
              <label htmlFor="product-image-upload">
                <Button variant="outlined" component="span" startIcon={<Image />}>
                  Chọn ảnh
                </Button>
              </label>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {(productFormData.images || []).map((img, index) => (
                  <Box key={`old-product-img-${index}`} sx={{ position: 'relative' }}>
                    <img src={img} alt="" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveProductImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', p: '2px', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {productImageFiles.map((file, index) => (
                  <Box key={`new-product-img-${index}`} sx={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(file)} alt="" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewProductImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', p: '2px', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={productFormData.is_active}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      is_active: e.target.checked,
                    })
                  }
                />
              }
              label="Hoạt động"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            {dialogMode === "create" ? "Thêm" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Variant Dialog */}
      <Dialog
        open={openVariantDialog}
        onClose={() => setOpenVariantDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create" ? "Thêm biến thể mới" : "Chỉnh sửa biến thể"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Tên biến thể"
              value={variantFormData.name}
              onChange={(e) =>
                setVariantFormData({ ...variantFormData, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="SKU"
              value={variantFormData.sku}
              onChange={(e) =>
                setVariantFormData({ ...variantFormData, sku: e.target.value })
              }
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Giá bán"
                type="number"
                value={variantFormData.price}
                onChange={(e) =>
                  setVariantFormData({
                    ...variantFormData,
                    price: Number(e.target.value),
                  })
                }
              />
              <TextField
                fullWidth
                label="Giá gốc"
                type="number"
                value={variantFormData.original_price}
                onChange={(e) =>
                  setVariantFormData({
                    ...variantFormData,
                    original_price: Number(e.target.value),
                  })
                }
              />
            </Box>
            <TextField
              fullWidth
              label="Số lượng tồn kho"
              type="number"
              value={variantFormData.countInStock}
              onChange={(e) =>
                setVariantFormData({
                  ...variantFormData,
                  countInStock: Number(e.target.value),
                })
              }
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Màu sắc"
                value={variantFormData.color}
                onChange={(e) =>
                  setVariantFormData({
                    ...variantFormData,
                    color: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Dung lượng"
                value={variantFormData.storage}
                onChange={(e) =>
                  setVariantFormData({
                    ...variantFormData,
                    storage: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Kích thước"
                value={variantFormData.size}
                onChange={(e) =>
                  setVariantFormData({
                    ...variantFormData,
                    size: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Chất liệu"
                value={variantFormData.material}
                onChange={(e) =>
                  setVariantFormData({
                    ...variantFormData,
                    material: e.target.value,
                  })
                }
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Hình ảnh biến thể
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="variant-image-upload"
                multiple
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setVariantImageFiles((prev) => [...prev, ...Array.from(e.target.files)]);
                  }
                }}
              />
              <label htmlFor="variant-image-upload">
                <Button variant="outlined" component="span" startIcon={<Image />}>
                  Chọn ảnh
                </Button>
              </label>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {(variantFormData.images || []).map((img, index) => (
                  <Box key={`old-variant-img-${index}`} sx={{ position: 'relative' }}>
                    <img src={img} alt="" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveVariantImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', p: '2px', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {variantImageFiles.map((file, index) => (
                  <Box key={`new-variant-img-${index}`} sx={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(file)} alt="" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewVariantImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', p: '2px', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={variantFormData.is_active}
                  onChange={(e) =>
                    setVariantFormData({
                      ...variantFormData,
                      is_active: e.target.checked,
                    })
                  }
                />
              }
              label="Hoạt động"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVariantDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveVariant}>
            {dialogMode === "create" ? "Thêm" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductVariantManagement;
