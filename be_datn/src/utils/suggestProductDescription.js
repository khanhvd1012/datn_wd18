import { resolveCategoryKey } from "./suggestProductPrice.js";

const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const parseMah = (text) => {
  const m = text.match(/(\d+(?:\.\d+)?)\s*mah/i);
  return m ? m[0] : null;
};

const parseWatt = (text) => {
  const m = text.match(/(\d+(?:\.\d+)?)\s*w\b/i);
  return m ? m[0] : null;
};

const parseLength = (text) => {
  const m = text.match(/(\d+(?:\.\d+)?)\s*m(?!\s*a)/i);
  return m ? m[1] + "m" : null;
};

const extractDevices = (text) => {
  const devices = [];
  const patterns = [
    /iphone\s*\d+\s*(?:pro\s*max|pro|plus|max)?/gi,
    /galaxy\s*z\s*(?:fold|flip)\s*\d+/gi,
    /ipad\s*(?:pro|air|mini)?/gi,
    /samsung\s*galaxy\s*s\d+/gi,
  ];
  patterns.forEach((p) => {
    const found = text.match(p);
    if (found) devices.push(...found.map((s) => s.trim()));
  });
  return [...new Set(devices)];
};

const joinSpecs = (parts) => parts.filter(Boolean).join(", ");

const footer =
  "Sản phẩm phân phối tại Mobitech — cam kết hàng chính hãng, hỗ trợ đổi trả theo chính sách cửa hàng.";

const KNOWN_BRANDS = [
  "joyroom",
  "anker",
  "apple",
  "beats",
  "samsung",
  "havit",
  "mpow",
  "sanag",
  "vtuoge",
  "redmi",
  "oppo",
  "baseus",
  "ugreen",
  "belkin",
];

const extractBrandFromName = (name = "") => {
  const lower = normalize(name);
  for (const b of KNOWN_BRANDS) {
    if (lower.includes(b)) {
      return b.charAt(0).toUpperCase() + b.slice(1);
    }
  }
  return "";
};

const resolveBrandLabel = (name, brandName) => {
  const fromName = extractBrandFromName(name);
  if (fromName) return fromName;
  if (brandName && normalize(brandName) !== "apple") return brandName;
  if (brandName && normalize(name).includes("airpods")) return "Apple";
  return "";
};

/** Mô tả quá ngắn, trùng tên, hoặc chỉ là số/ký tự vô nghĩa */
export const isDescriptionNeedsUpdate = (description, productName = "") => {
  const d = (description || "").trim();
  const name = (productName || "").trim();
  if (!d) return true;
  if (d === name) return true;
  if (d.length < 60) return true;
  if (/^[\d\s.,₫đ]+$/.test(d)) return true;
  if (/^(test|mo ta|mô tả|san pham|op|cap)$/i.test(normalize(d))) return true;
  if (name.length > 5 && normalize(d) === normalize(name)) return true;
  return false;
};

const buildCableDesc = (name, text, brandName) => {
  const len = parseLength(text);
  const watt = parseWatt(text);
  const specs = joinSpecs([
    len ? `chiều dài ${len}` : null,
    watt ? `hỗ trợ sạc nhanh ${watt}` : "hỗ trợ sạc nhanh và truyền dữ liệu ổn định",
    text.includes("usb-c") ? "cổng USB-C" : null,
    text.includes("lightning") ? "cổng Lightning" : null,
  ]);
  return [
    `${name}${brandName ? ` (${brandName})` : ""} — cáp sạc chất lượng cao, ${specs}, lõi đồng bọc chống nhiễu giúp sạc ổn định và bền hơn.`,
    "Vỏ cáp chống đứt gãy, dễ cuốn gọn khi mang theo. Tương thích đa dạng smartphone, tablet và phụ kiện sạc.",
    footer,
  ].join(" ");
};

const buildWirelessChargerDesc = (name, text, brandName) => {
  const watt = parseWatt(text);
  const isMagSafe = text.includes("magsafe");
  return [
    `${name}${brandName ? ` — ${brandName}` : ""} — ${isMagSafe ? "đế sạc MagSafe" : "đế sạc không dây"} ${watt ? `công suất ${watt}` : "công suất tối ưu"}, sạc tiện lợi không cần cắm dây.`,
    isMagSafe
      ? "Nam châm căn chỉnh chuẩn vị trí, tương thích iPhone hỗ trợ MagSafe và nhiều thiết bị Qi."
      : "Tương thích chuẩn Qi, đặt máy lên là sạc — phù hợp bàn làm việc, đầu giường.",
    "Thiết kế gọn, chống trượt, có bảo vệ nhiệt và quá dòng. " + footer,
  ].join(" ");
};

const buildPowerBankDesc = (name, text, brandName) => {
  const cap = parseMah(text);
  const watt = parseWatt(text);
  const isMagSafe = text.includes("magsafe");
  return [
    `${name}${brandName ? ` — ${brandName}` : ""} — pin dự phòng ${cap || "dung lượng cao"}${watt ? `, sạc nhanh ${watt}` : ""}, nạp năng lượng mọi lúc khi đi làm, du lịch.`,
    isMagSafe
      ? "Hỗ trợ sạc không dây MagSafe cho iPhone, tiện lợi không cần cáp."
      : "Trang bị nhiều cổng USB/USB-C, sạc đồng thời nhiều thiết bị.",
    "Tích hợp bảo vệ quá dòng, quá áp, quá nhiệt — an toàn cho thiết bị. " + footer,
  ].join(" ");
};

const buildCaseDesc = (name, text, brandName) => {
  const devices = extractDevices(text);
  const isMagSafe = text.includes("magsafe");
  const isFold = text.includes("fold") || text.includes("flip");
  return [
    `${name}${brandName ? ` — ${brandName}` : ""} — ốp lưng ${isMagSafe ? "MagSafe" : "bảo vệ toàn diện"}${devices.length ? ` dành cho ${devices.join(", ")}` : ""}.`,
    isFold
      ? "Thiết kế ôm khít bản lề, bảo vệ máy khi gập mở, không ảnh hưởng cảm biến vân tay."
      : "Chống va đập, trầy xước hàng ngày, cutout chính xác cho camera và cổng sạc.",
    isMagSafe
      ? "Tương thích phụ kiện MagSafe: sạc không dây, ví nam châm."
      : "Bề mặt chống bám vân tay, cầm chắc tay.",
    footer,
  ].join(" ");
};

const buildScreenProtectorDesc = (name, text, brandName) => {
  const devices = extractDevices(text);
  return [
    `${name}${brandName ? ` — ${brandName}` : ""} — miếng dán kính cường lực${devices.length ? ` cho ${devices.join(", ")}` : ""}, độ cứng cao chống trầy, va đập.`,
    "Độ trong suốt cao, hạn chế bám vân tay, cảm ứng nhạy như màn hình gốc. Dễ dán tại nhà hoặc nhờ kỹ thuật viên Mobitech hỗ trợ.",
    footer,
  ].join(" ");
};

const buildEarphoneDesc = (name, text, brandName) => {
  const isApple =
    text.includes("airpods") || (text.includes("apple") && !text.includes("beats"));
  const hasAnc = text.includes("pro") || text.includes("chống ồn") || text.includes("anc");
  return [
    `${name}${brandName ? ` — ${brandName}` : ""} — tai nghe ${isApple ? "không dây" : "Bluetooth"} ${hasAnc ? "có chống ồn chủ động" : "âm thanh sống động"}, kết nối ổn định, pin dùng cả ngày.`,
    isApple
      ? "Tích hợp chip Apple, chuyển đổi thiết bị mượt trong hệ sinh thái iPhone/iPad/Mac."
      : "Bluetooth 5.x, mic đàm thoại rõ, phù hợp làm việc, học tập và giải trí.",
    "Hộp sạc tiện lợi, đeo thoải mái lâu dài. " + footer,
  ].join(" ");
};

const buildHolderDesc = (name, text, brandName, isIpad = false) => {
  return [
    `${name}${brandName ? ` — ${brandName}` : ""} — ${isIpad ? "giá đỡ iPad/tablet" : "giá đỡ điện thoại"} chắc chắn, xem phim, học online, làm việc ở góc nghiêng thoải mái.`,
    text.includes("o to") || text.includes("xe")
      ? "Gắn chắc trên xe, chống rung khi di chuyển, xem bản đồ an toàn."
      : "Chống trượt, gập gọn hoặc điều chỉnh góc linh hoạt tùy model.",
    footer,
  ].join(" ");
};

const buildDefaultDesc = (name, categoryName, brandName) => {
  return [
    `${name}${brandName ? ` — thương hiệu ${brandName}` : ""} — phụ kiện công nghệ chất lượng, phù hợp nhu cầu sử dụng hàng ngày.`,
    `Thuộc danh mục ${categoryName || "phụ kiện"} tại Mobitech, đảm bảo nguồn gốc và chính sách bảo hành rõ ràng.`,
    footer,
  ].join(" ");
};

/**
 * @param {{ categoryName?: string, name?: string, brandName?: string, attributes?: object }} input
 */
export const suggestProductDescription = ({
  categoryName = "",
  name = "",
  brandName = "",
  attributes = {},
}) => {
  const text = `${name} ${Object.values(attributes).join(" ")}`.toLowerCase();
  const key = resolveCategoryKey(categoryName);
  const brand = resolveBrandLabel(name, brandName);

  switch (key) {
    case "cap sac nhanh":
      return buildCableDesc(name, text, brand);
    case "de sac khong day":
      return buildWirelessChargerDesc(name, text, brand);
    case "pin du phong":
      return buildPowerBankDesc(name, text, brand);
    case "op lung":
      return buildCaseDesc(name, text, brand);
    case "kinh cuong luc":
      return buildScreenProtectorDesc(name, text, brand);
    case "tai nghe bluetooth":
      return buildEarphoneDesc(name, text, brand);
    case "gia do ipad":
      return buildHolderDesc(name, text, brand, true);
    case "gia do chong xoay":
      return buildHolderDesc(name, text, brand, false);
    default:
      return buildDefaultDesc(name, categoryName, brand);
  }
};
