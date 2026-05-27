/**
 * Gợi ý giá bán (VND) theo danh mục phụ kiện Mobitech.
 * Giá làm tròn nghìn đồng, original_price ~ +18–25% so với giá bán.
 */

const roundPrice = (n) => Math.max(1000, Math.round(n / 1000) * 1000);

const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const parseMah = (text, attrs = {}) => {
  const fromText = text.match(/(\d+(?:\.\d+)?)\s*mah/i);
  if (fromText) return parseFloat(fromText[1]);
  const cap = attrs.capacity || attrs.storage || attrs["Dung lượng"];
  if (cap) {
    const m = String(cap).match(/(\d+)/);
    if (m) return parseFloat(m[1]);
  }
  return null;
};

const parseWatt = (text, attrs = {}) => {
  const fromText = text.match(/(\d+(?:\.\d+)?)\s*w\b/i);
  if (fromText) return parseFloat(fromText[1]);
  const p = attrs.power || attrs["Công suất"];
  if (p) {
    const m = String(p).match(/(\d+(?:\.\d+)?)/);
    if (m) return parseFloat(m[1]);
  }
  return null;
};

const parseLengthM = (text) => {
  const m = text.match(/(\d+(?:\.\d+)?)\s*m(?!\s*a)/i);
  return m ? parseFloat(m[1]) : null;
};

const withOriginal = (price, markup = 1.22) => ({
  price: roundPrice(price),
  original_price: roundPrice(price * markup),
});

/** Khoảng giá hợp lệ theo danh mục (để phát hiện giá sai) */
export const CATEGORY_PRICE_BOUNDS = {
  "cap sac nhanh": { min: 69000, max: 450000 },
  "de sac khong day": { min: 249000, max: 1490000 },
  "gia do chong xoay": { min: 99000, max: 550000 },
  "gia do ipad": { min: 199000, max: 890000 },
  "pin du phong": { min: 249000, max: 1890000 },
  "tai nghe bluetooth": { min: 690000, max: 7990000 },
  "op lung": { min: 99000, max: 1590000 },
  "kinh cuong luc": { min: 49000, max: 450000 },
  default: { min: 49000, max: 9990000 },
};

export const resolveCategoryKey = (categoryName = "") => {
  const c = normalize(categoryName);
  if (c.includes("cap sac") || c.includes("cap")) return "cap sac nhanh";
  if (c.includes("de sac") || c.includes("khong day")) return "de sac khong day";
  if (c.includes("ipad")) return "gia do ipad";
  if (c.includes("gia do") || c.includes("keo")) return "gia do chong xoay";
  if (c.includes("pin") || c.includes("du phong") || c.includes("power bank"))
    return "pin du phong";
  if (c.includes("tai nghe") || c.includes("airpods") || c.includes("earphone"))
    return "tai nghe bluetooth";
  if (c.includes("op lung") || c.includes("oplung") || c === "op")
    return "op lung";
  if (c.includes("kinh cuong luc") || c.includes("cuong luc") || c.includes("dan man"))
    return "kinh cuong luc";
  return "default";
};

export const isPriceOutOfRange = (price, categoryName) => {
  if (price == null || Number.isNaN(price)) return true;
  const key = resolveCategoryKey(categoryName);
  const bounds = CATEGORY_PRICE_BOUNDS[key] || CATEGORY_PRICE_BOUNDS.default;
  return price < bounds.min || price > bounds.max;
};

const suggestCablePrice = (text, attrs) => {
  let base = 129000;
  const len = parseLengthM(text) || (attrs.length ? parseFloat(String(attrs.length)) : null);
  if (len && len >= 2) base = 189000;
  if (text.includes("100w") || text.includes("usb-c")) base += 30000;
  if (text.includes("lightning") || text.includes("iphone")) base += 10000;
  return withOriginal(base);
};

const suggestWirelessChargerPrice = (text) => {
  let base = 449000;
  if (text.includes("magsafe")) base = 890000;
  const w = parseWatt(text);
  if (w && w >= 15) base = Math.max(base, 790000);
  if (text.includes("gap") || text.includes("fold")) base = Math.min(base, 590000);
  return withOriginal(base);
};

const suggestHolderPrice = (text, isIpad = false) => {
  let base = isIpad ? 329000 : 219000;
  if (text.includes("tu tinh") || text.includes("magnetic")) base += 40000;
  if (text.includes("dieu chinh") || text.includes("adjust")) base += 50000;
  if (text.includes("gap gon") || text.includes("fold")) base += 30000;
  return withOriginal(base);
};

const suggestPowerBankPrice = (text, attrs) => {
  const mAh = parseMah(text, attrs);
  const watt = parseWatt(text, attrs);
  let base = 399000;

  if (mAh != null) {
    if (mAh >= 30000) base = 990000;
    else if (mAh >= 20000) base = 690000;
    else if (mAh >= 10000) base = 490000;
    else if (mAh >= 5000) base = 390000;
    else base = 299000;
  }

  if (text.includes("magsafe")) base = Math.max(base, 990000);
  if (watt != null) {
    if (watt >= 65) base += 200000;
    else if (watt >= 45) base += 120000;
    else if (watt >= 22) base += 60000;
  }

  if (text.includes("joyroom") || text.includes("anker") || text.includes("baseus"))
    base += 50000;

  return withOriginal(base);
};

const suggestCasePrice = (text) => {
  let base = 249000;
  if (text.includes("magsafe") || text.includes("leather")) base = 590000;
  if (text.includes("silicone") && !text.includes("magsafe")) base = 390000;
  if (
    text.includes("fold") ||
    text.includes("flip") ||
    text.includes("z fold") ||
    text.includes("z flip")
  )
    base = 790000;
  if (text.includes("galaxy") || text.includes("samsung")) base = Math.max(base, 350000);
  return withOriginal(base);
};

const suggestScreenProtectorPrice = (text) => {
  let base = 89000;
  if (text.includes("pro max") || text.includes("16 pro") || text.includes("15 pro"))
    base = 149000;
  else if (text.includes("pro") || text.includes("plus")) base = 129000;
  if (text.includes("privacy") || text.includes("mat")) base += 40000;
  return withOriginal(base, 1.25);
};

const suggestEarphonePrice = (text) => {
  const thirdParty =
    text.includes("anker") ||
    text.includes("joyroom") ||
    text.includes("havit") ||
    text.includes("mpow") ||
    text.includes("sanag") ||
    text.includes("vtuoge") ||
    text.includes("a9 pro");

  if (thirdParty) {
    let base = 390000;
    if (text.includes("pro") || text.includes("anc") || text.includes("chong on"))
      base = 590000;
    if (text.includes("beats")) base = 890000;
    return withOriginal(base);
  }

  let base = 1290000;
  if (text.includes("pro 2") || text.includes("pro2")) base = 5490000;
  else if (text.includes("airpods pro") || (text.includes("pro") && text.includes("airpods")))
    base = 4990000;
  else if (text.includes("airpods 3") || text.includes("gen 3")) base = 3790000;
  else if (text.includes("airpods 2")) base = 2790000;
  else if (text.includes("airpods 4")) base = 4990000;
  else if (text.includes("airpods")) base = 3490000;
  return withOriginal(base, 1.18);
};

/**
 * @param {{ categoryName?: string, name?: string, description?: string, attributes?: object }} input
 */
export const suggestProductPrice = ({
  categoryName = "",
  name = "",
  description = "",
  attributes = {},
}) => {
  const text = `${name} ${description}`.toLowerCase();
  const key = resolveCategoryKey(categoryName);
  const flatAttrs =
    attributes && typeof attributes === "object"
      ? Object.fromEntries(
          Object.entries(attributes).map(([k, v]) => [k, String(v)]),
        )
      : {};

  switch (key) {
    case "cap sac nhanh":
      return suggestCablePrice(text, flatAttrs);
    case "de sac khong day":
      return suggestWirelessChargerPrice(text);
    case "gia do ipad":
      return suggestHolderPrice(text, true);
    case "gia do chong xoay":
      return suggestHolderPrice(text, false);
    case "pin du phong":
      return suggestPowerBankPrice(text, flatAttrs);
    case "tai nghe bluetooth":
      return suggestEarphonePrice(text);
    case "op lung":
      return suggestCasePrice(text);
    case "kinh cuong luc":
      return suggestScreenProtectorPrice(text);
    default:
      return withOriginal(199000);
  }
};

/**
 * Giá variant: variant đầu = base, mỗi variant sau +15.000đ (tối đa +30.000)
 */
export const suggestVariantPrices = (basePrice, originalPrice, variantIndex, totalVariants) => {
  const extra = Math.min(variantIndex * 15000, 30000);
  return {
    price: roundPrice(basePrice + extra),
    original_price: roundPrice(originalPrice + extra),
  };
};
