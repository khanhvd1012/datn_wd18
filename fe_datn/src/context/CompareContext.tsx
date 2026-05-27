import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CompareItem } from "../types/compare";
import { MAX_COMPARE_ITEMS } from "../types/compare";
import { buildPerformanceValues } from "../utils/comparePerformance";

const STORAGE_KEY = "mobitech_compare_items";

type AddResult = { ok: boolean; message: string };

type CompareContextValue = {
  items: CompareItem[];
  count: number;
  maxItems: number;
  categoryName: string | null;
  addItem: (item: CompareItem) => AddResult;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CompareItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item: CompareItem) => ({
        ...item,
        performance:
          item.performance ??
          buildPerformanceValues(
            item.categoryName || "",
            item.attributes || {},
            item.name || "",
          ),
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const categoryName = useMemo(
    () => (items.length > 0 ? items[0].categoryName : null),
    [items],
  );

  const addItem = useCallback(
    (item: CompareItem): AddResult => {
      if (items.some((i) => i._id === item._id)) {
        return { ok: false, message: "Sản phẩm đã có trong danh sách so sánh" };
      }
      if (items.length >= MAX_COMPARE_ITEMS) {
        return {
          ok: false,
          message: `Chỉ so sánh tối đa ${MAX_COMPARE_ITEMS} sản phẩm`,
        };
      }
      if (items.length > 0 && items[0].categoryId !== item.categoryId) {
        return {
          ok: false,
          message: `Chỉ so sánh sản phẩm cùng danh mục (${items[0].categoryName})`,
        };
      }
      if (!item.categoryId) {
        return { ok: false, message: "Sản phẩm chưa có danh mục để so sánh" };
      }

      setItems((prev) => [...prev, item]);
      return { ok: true, message: "Đã thêm vào so sánh" };
    },
    [items],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const isInCompare = useCallback(
    (id: string) => items.some((i) => i._id === id),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      maxItems: MAX_COMPARE_ITEMS,
      categoryName,
      addItem,
      removeItem,
      clearAll,
      isInCompare,
    }),
    [items, categoryName, addItem, removeItem, clearAll, isInCompare],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
