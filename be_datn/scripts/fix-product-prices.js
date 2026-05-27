/**
 * Cập nhật giá tất cả sản phẩm theo danh mục (phụ kiện Mobitech).
 * Chạy: node scripts/fix-product-prices.js
 * Chỉ sửa khi giá ngoài khoảng hợp lệ hoặc --force
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/product_MD.js";
import Variant from "../src/models/variant_MD.js";
import Category from "../src/models/category_MD.js";
import {
  suggestProductPrice,
  suggestVariantPrices,
  isPriceOutOfRange,
} from "../src/utils/suggestProductPrice.js";

dotenv.config();

const force = process.argv.includes("--force");

const flattenAttrs = (variant) => {
  const attrs = {};
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

  const products = await Product.find().populate("category", "name");
  let updatedProducts = 0;
  let updatedVariants = 0;
  let skipped = 0;

  for (const product of products) {
    const categoryName = product.category?.name || "";
    const defaultVariant = await Variant.findOne({
      product: product._id,
      is_default: true,
    });
    const firstVariant =
      defaultVariant || (await Variant.findOne({ product: product._id }));

    const attrs = firstVariant ? flattenAttrs(firstVariant) : {};
    const suggested = suggestProductPrice({
      categoryName,
      name: product.name,
      description: product.description,
      attributes: attrs,
    });

    const shouldUpdate =
      force || isPriceOutOfRange(product.price, categoryName);

    if (!shouldUpdate) {
      skipped++;
      continue;
    }

    await Product.findByIdAndUpdate(product._id, {
      price: suggested.price,
      original_price: suggested.original_price,
    });
    updatedProducts++;

    const variants = await Variant.find({ product: product._id }).sort({
      is_default: -1,
      createdAt: 1,
    });

    for (let i = 0; i < variants.length; i++) {
      const vp = suggestVariantPrices(
        suggested.price,
        suggested.original_price,
        i,
        variants.length,
      );
      await Variant.findByIdAndUpdate(variants[i]._id, vp);
      updatedVariants++;
    }

    console.log(
      `📦 ${product.name} [${categoryName || "N/A"}]\n` +
        `   ${product.price?.toLocaleString("vi-VN")}₫ → ${suggested.price.toLocaleString("vi-VN")}₫`,
    );
  }

  console.log("\n--- Kết quả ---");
  console.log(`Sản phẩm cập nhật: ${updatedProducts}`);
  console.log(`Biến thể cập nhật: ${updatedVariants}`);
  console.log(`Bỏ qua (giá đã hợp lệ): ${skipped}`);
  if (!force && skipped > 0) {
    console.log("\n💡 Dùng --force để cập nhật lại toàn bộ giá theo danh mục.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
