export type CompareHighlight = "max" | "min";

export type PerformanceSpecDef = {
  key: string;
  label: string;
  /** Các key trong variant.attributes hoặc field variant */
  attrKeys: string[];
  highlight?: CompareHighlight;
  /** Đơn vị hiển thị khi parse số (vd: mAh, W, m) */
  unit?: string;
};

const pinSpecs: PerformanceSpecDef[] = [
  {
    key: "capacity",
    label: "Dung lượng pin",
    attrKeys: ["capacity", "Dung lượng", "storage", "dung_luong"],
    highlight: "max",
    unit: "mAh",
  },
  {
    key: "power",
    label: "Công suất sạc",
    attrKeys: ["power", "Công suất", "watt", "cong_suat"],
    highlight: "max",
    unit: "W",
  },
  {
    key: "connector",
    label: "Cổng kết nối",
    attrKeys: ["connector", "Cổng kết nối", "port", "ports"],
  },
  {
    key: "charging_tech",
    label: "Công nghệ sạc",
    attrKeys: ["charging_tech", "type", "Loại", "technology", "pd", "qc"],
  },
  {
    key: "input_output",
    label: "Đầu vào / Đầu ra",
    attrKeys: ["input_output", "io", "input", "output"],
  },
];

const cableSpecs: PerformanceSpecDef[] = [
  {
    key: "power",
    label: "Công suất hỗ trợ",
    attrKeys: ["power", "Công suất", "watt"],
    highlight: "max",
    unit: "W",
  },
  {
    key: "length",
    label: "Chiều dài cáp",
    attrKeys: ["length", "Độ dài", "chieu_dai"],
    highlight: "max",
    unit: "m",
  },
  {
    key: "connector",
    label: "Cổng kết nối",
    attrKeys: ["connector", "Cổng kết nối", "type", "Loại"],
  },
  {
    key: "material",
    label: "Chất liệu cáp",
    attrKeys: ["material", "Chất liệu"],
  },
];

const wirelessChargerSpecs: PerformanceSpecDef[] = [
  {
    key: "power",
    label: "Công suất sạc",
    attrKeys: ["power", "Công suất", "watt"],
    highlight: "max",
    unit: "W",
  },
  {
    key: "charging_tech",
    label: "Chuẩn sạc",
    attrKeys: ["type", "Loại", "charging_tech", "technology"],
  },
  {
    key: "foldable",
    label: "Thiết kế gập",
    attrKeys: ["foldable", "Gập gọn"],
  },
  {
    key: "compatible",
    label: "Tương thích",
    attrKeys: ["compatible", "model", "device"],
  },
];

const holderSpecs: PerformanceSpecDef[] = [
  {
    key: "mount",
    label: "Kiểu gắn",
    attrKeys: ["mount", "Kiểu gắn", "type", "Loại"],
  },
  {
    key: "adjustable",
    label: "Điều chỉnh góc",
    attrKeys: ["adjustable", "Điều chỉnh"],
  },
  {
    key: "foldable",
    label: "Gập gọn",
    attrKeys: ["foldable", "Gập gọn"],
  },
  {
    key: "compatible",
    label: "Thiết bị hỗ trợ",
    attrKeys: ["compatible", "model", "device"],
  },
];

const audioSpecs: PerformanceSpecDef[] = [
  {
    key: "model",
    label: "Phiên bản / Model",
    attrKeys: ["model", "Model", "version"],
  },
  {
    key: "connectivity",
    label: "Kết nối",
    attrKeys: ["connectivity", "type", "Loại", "bluetooth"],
  },
  {
    key: "battery",
    label: "Pin tai nghe",
    attrKeys: ["battery", "capacity", "Dung lượng"],
    highlight: "max",
    unit: "mAh",
  },
  {
    key: "noise_cancellation",
    label: "Chống ồn",
    attrKeys: ["noise_cancellation", "anc", "chong_on"],
  },
];

/** Map theo tên danh mục (chữ thường, không dấu) */
export const PERFORMANCE_SPECS_BY_CATEGORY: Record<string, PerformanceSpecDef[]> = {
  "pin du phong": pinSpecs,
  "cap sac nhanh": cableSpecs,
  "de sac khong day": wirelessChargerSpecs,
  "gia do chong xoay": holderSpecs,
  "gia do ipad": holderSpecs,
  "tai nghe": audioSpecs,
  "airpods": audioSpecs,
};

export const DEFAULT_PERFORMANCE_SPECS: PerformanceSpecDef[] = [
  {
    key: "power",
    label: "Công suất",
    attrKeys: ["power", "Công suất", "watt"],
    highlight: "max",
    unit: "W",
  },
  {
    key: "capacity",
    label: "Dung lượng",
    attrKeys: ["capacity", "Dung lượng", "storage"],
    highlight: "max",
    unit: "mAh",
  },
  {
    key: "length",
    label: "Kích thước / Chiều dài",
    attrKeys: ["length", "Độ dài", "size", "Kích thước"],
    highlight: "max",
  },
  {
    key: "type",
    label: "Loại / Chuẩn",
    attrKeys: ["type", "Loại", "connector", "technology"],
  },
];

export const APPEARANCE_ATTR_KEYS = new Set([
  "color",
  "màu sắc",
  "mausac",
  "material",
  "chất liệu",
  "chatlieu",
  "size",
  "kích thước",
  "kichthuoc",
]);
