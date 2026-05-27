import type { CompareItem } from "../types/compare";
import { buildPerformanceValues } from "./comparePerformance";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23eee' width='200' height='200'/%3E%3C/svg%3E";

const getImageUrl = (path?: string) => {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (path.startsWith("uploads/")) return `http://localhost:3000/${path}`;
  return `http://localhost:3000/uploads/products/${path}`;
};

const getCategoryInfo = (category: unknown) => {
  if (!category) return { id: "", name: "" };
  if (typeof category === "string") return { id: category, name: "" };
  const c = category as { _id?: string; name?: string };
  return { id: c._id || "", name: c.name || "" };
};

const getBrandName = (brand: unknown) => {
  if (!brand) return "";
  if (typeof brand === "string") return brand;
  return (brand as { name?: string }).name || "";
};

const getDefaultVariant = (product: any) => {
  const variants = product?.variants || [];
  if (!variants.length) return null;
  return variants.find((v: any) => v.is_default) || variants[0];
};

const collectAttributes = (product: any): Record<string, string> => {
  const attrs: Record<string, string> = {};
  const variant = getDefaultVariant(product);

  const setIf = (key: string, val?: string) => {
    if (val) attrs[key] = val;
  };

  if (variant) {
    setIf("Màu sắc", variant.color);
    setIf("Kích thước", variant.size);
    setIf("Dung lượng", variant.storage);
    setIf("Chất liệu", variant.material);

    const raw = variant.attributes;
    if (raw && typeof raw === "object") {
      if (typeof raw.get === "function") {
        raw.forEach((v: string, k: string) => {
          if (v) attrs[k] = v;
        });
      } else {
        Object.entries(raw).forEach(([k, v]) => {
          if (v) attrs[k] = String(v);
        });
      }
    }
  }

  return attrs;
};

export const productToCompareItem = (product: any): CompareItem => {
  const category = getCategoryInfo(product.category);
  const variant = getDefaultVariant(product);
  const price = variant?.price ?? product.price ?? 0;
  const stock =
    product.variants?.length > 0
      ? product.variants.reduce(
          (sum: number, v: any) => sum + (v.stock ?? v.countInStock ?? 0),
          0,
        )
      : product.countInStock ?? 0;

  const image =
    variant?.images?.[0] ||
    product.images?.[0] ||
    product.img ||
    "";

  const allAttributes = collectAttributes(product);
  const performance = buildPerformanceValues(
    category.name,
    allAttributes,
    [product.name, product.description].filter(Boolean).join(" "),
  );

  return {
    _id: product._id || product.id,
    name: product.name,
    image: getImageUrl(image),
    price,
    original_price: product.original_price,
    brandName: getBrandName(product.brand),
    categoryId: category.id,
    categoryName: category.name,
    stock,
    rating: product.rating ?? 4.5,
    reviewCount: product.reviews ?? 0,
    attributes: allAttributes,
    performance,
  };
};

export const ATTRIBUTE_LABELS: Record<string, string> = {
  color: "Màu sắc",
  length: "Độ dài",
  power: "Công suất",
  capacity: "Dung lượng",
  connector: "Cổng kết nối",
  mount: "Kiểu gắn",
  foldable: "Gập gọn",
  material: "Chất liệu",
  storage: "Dung lượng",
  size: "Kích thước",
  type: "Loại",
  adjustable: "Điều chỉnh",
  "Màu sắc": "Màu sắc",
  "Kích thước": "Kích thước",
  "Dung lượng": "Dung lượng",
  "Chất liệu": "Chất liệu",
};

export const getAttributeLabel = (key: string) =>
  ATTRIBUTE_LABELS[key] || key.replace(/_/g, " ");
