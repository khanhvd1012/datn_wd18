import {
  APPEARANCE_ATTR_KEYS,
  DEFAULT_PERFORMANCE_SPECS,
  PERFORMANCE_SPECS_BY_CATEGORY,
  type PerformanceSpecDef,
} from "../config/compareSpecsByCategory";

const normalizeKey = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeCategoryName = (name: string) => normalizeKey(name);

export const getPerformanceSpecDefs = (categoryName: string): PerformanceSpecDef[] => {
  const key = normalizeCategoryName(categoryName);
  if (PERFORMANCE_SPECS_BY_CATEGORY[key]) {
    return PERFORMANCE_SPECS_BY_CATEGORY[key];
  }
  const partial = Object.entries(PERFORMANCE_SPECS_BY_CATEGORY).find(([k]) =>
    key.includes(k) || k.includes(key),
  );
  if (partial) return partial[1];
  return DEFAULT_PERFORMANCE_SPECS;
};

const flattenAttributes = (attributes: Record<string, string>): Record<string, string> => {
  const map: Record<string, string> = {};
  Object.entries(attributes || {}).forEach(([k, v]) => {
    if (!v) return;
    map[normalizeKey(k)] = v;
    map[k] = v;
  });
  return map;
};

const pickAttr = (flat: Record<string, string>, keys: string[]): string => {
  for (const k of keys) {
    const v = flat[k] ?? flat[normalizeKey(k)];
    if (v) return v;
  }
  return "";
};

/** Trích số từ chuỗi spec (12.322₫, 20000mAh, 22.5W, 2m...) */
export const parseSpecNumber = (value: string, unit?: string): number | null => {
  if (!value || value === "—") return null;
  const cleaned = value.replace(/,/g, ".").replace(/\s/g, "");
  if (unit === "mAh") {
    const m = cleaned.match(/(\d+(?:\.\d+)?)\s*mah/i);
    if (m) return parseFloat(m[1]);
  }
  if (unit === "W") {
    const m = cleaned.match(/(\d+(?:\.\d+)?)\s*w/i);
    if (m) return parseFloat(m[1]);
  }
  if (unit === "m") {
    const m = cleaned.match(/(\d+(?:\.\d+)?)\s*m(?!a)/i);
    if (m) return parseFloat(m[1]);
  }
  const num = cleaned.match(/(\d+(?:\.\d+)?)/);
  return num ? parseFloat(num[1]) : null;
};

const extractFromProductName = (
  productName: string,
): Partial<Record<string, string>> => {
  const out: Partial<Record<string, string>> = {};
  const cap = productName.match(/(\d+(?:\.\d+)?)\s*mAh/i);
  if (cap) out.capacity = cap[0];
  const watt = productName.match(/(\d+(?:\.\d+)?)\s*W/i);
  if (watt) out.power = watt[0];
  const len = productName.match(/(\d+(?:\.\d+)?)\s*m(?!\s*a)/i);
  if (len && !cap) out.length = len[0];
  return out;
};

export const buildPerformanceValues = (
  categoryName: string,
  attributes: Record<string, string>,
  productName = "",
): Record<string, string> => {
  const defs = getPerformanceSpecDefs(categoryName);
  const flat = flattenAttributes(attributes);
  const fromName = extractFromProductName(productName);
  const result: Record<string, string> = {};

  defs.forEach((def) => {
    let val = pickAttr(flat, def.attrKeys);
    if (!val && fromName[def.key as keyof typeof fromName]) {
      val = fromName[def.key as keyof typeof fromName] as string;
    }
    result[def.key] = val || "—";
  });

  return result;
};

export const getAppearanceAttributes = (
  attributes: Record<string, string>,
): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(attributes || {}).forEach(([k, v]) => {
    if (!v) return;
    if (APPEARANCE_ATTR_KEYS.has(normalizeKey(k))) {
      out[k] = v;
    }
  });
  return out;
};

export type PerformanceRow = PerformanceSpecDef & {
  values: string[];
  numericValues: (number | null)[];
};

export const buildPerformanceRows = (
  categoryName: string,
  items: { attributes: Record<string, string>; name: string }[],
): PerformanceRow[] => {
  const defs = getPerformanceSpecDefs(categoryName);
  return defs.map((def) => {
    const values = items.map((item) => {
      const perf = buildPerformanceValues(
        categoryName,
        item.attributes,
        item.name,
      );
      return perf[def.key] || "—";
    });
    const numericValues = values.map((v) => parseSpecNumber(v, def.unit));
    return { ...def, values, numericValues };
  });
};

export const getBestPerformanceIndex = (row: PerformanceRow): number => {
  if (!row.highlight || row.numericValues.every((n) => n == null)) return -1;
  const nums = row.numericValues.map((n) => n ?? -Infinity);
  if (row.highlight === "max") {
    const max = Math.max(...nums.filter((n) => n !== -Infinity));
    if (!Number.isFinite(max)) return -1;
    return nums.indexOf(max);
  }
  const min = Math.min(...nums.filter((n) => n !== -Infinity));
  if (!Number.isFinite(min)) return -1;
  return nums.indexOf(min);
};

export const getPerformanceBarPercent = (
  value: number | null,
  allValues: (number | null)[],
): number => {
  const valid = allValues.filter((n): n is number => n != null && n > 0);
  if (value == null || value <= 0 || valid.length === 0) return 0;
  const max = Math.max(...valid);
  return Math.round((value / max) * 100);
};
