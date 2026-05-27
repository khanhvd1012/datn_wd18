export interface CompareItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  original_price?: number;
  brandName: string;
  categoryId: string;
  categoryName: string;
  stock: number;
  rating: number;
  reviewCount: number;
  attributes: Record<string, string>;
  /** Thuộc tính hiệu năng theo danh mục (dung lượng, công suất, ...) */
  performance: Record<string, string>;
}

export const MAX_COMPARE_ITEMS = 3;
