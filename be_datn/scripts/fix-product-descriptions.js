/**
 * Cập nhật mô tả sản phẩm theo danh mục và tên sản phẩm.
 * Chạy: npm run fix:descriptions
 * Cập nhật tất cả: npm run fix:descriptions:force
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/product_MD.js";
import Variant from "../src/models/variant_MD.js";
import "../src/models/category_MD.js";
import "../src/models/brand_MD.js";
import {
  suggestProductDescription,
  isDescriptionNeedsUpdate,
} from "../src/utils/suggestProductDescription.js";

dotenv.config();

const force = process.argv.includes("--force");

const flattenAttrs = (variant) => {
  const attrs = {};
  if (!variant) return attrs;
  if (variant.color) attrs.color = variant.color;
  if (variant.size) attrs.size = variant.size;
  if (variant.storage) attrs.storage = variant.storage;
  if (variant.material) attrs.material = variant.material;
  const raw = variant.attributes;
  if (raw && typeof raw === "object") {
    if (typeof raw.forEach === "function") {
      raw.forEach((v, k) => {
        attrs[k] = v;
      });
    } else {
      Object.assign(attrs, raw);
    }
  }
  return attrs;
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const products = await Product.find()
    .populate("category", "name")
    .populate("brand", "name");

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const categoryName = product.category?.name || "";
    const brandName = product.brand?.name || "";
    const defaultVariant = await Variant.findOne({
      product: product._id,
      is_default: true,
    });
    const firstVariant =
      defaultVariant || (await Variant.findOne({ product: product._id }));
    const attrs = flattenAttrs(firstVariant);

    const shouldUpdate =
      force || isDescriptionNeedsUpdate(product.description, product.name);

    if (!shouldUpdate) {
      skipped++;
      continue;
    }

    const description = suggestProductDescription({
      categoryName,
      name: product.name,
      brandName,
      attributes: attrs,
    });

    await Product.findByIdAndUpdate(product._id, { description });
    updated++;

    console.log(`📝 ${product.name} [${categoryName}]`);
    console.log(`   → ${description.slice(0, 120)}...\n`);
  }

  console.log("--- Kết quả ---");
  console.log(`Đã cập nhật: ${updated}`);
  console.log(`Bỏ qua (mô tả ổn): ${skipped}`);
  if (!force && skipped > 0) {
    console.log("\n💡 Dùng --force để viết lại mô tả toàn bộ sản phẩm.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
