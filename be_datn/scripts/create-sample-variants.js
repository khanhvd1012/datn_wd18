import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../src/models/product_MD.js";
import Variant from "../src/models/variant_MD.js";

dotenv.config();

const targetProductIds = [
  "69f3009868343f307481fb11", // Ốp lưng Silicone/Leather MagSafe
  "69f3010968343f307481fb19", // Sạc MagSafe
  "69f3017c68343f307481fb21", // Bộ sạc lightning
];

const samples = [
  { suffix: "Tiêu chuẩn", mul: 1, attrs: {} },
  { suffix: "Cao cấp", mul: 1.15, attrs: { material: "Premium" } },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const products = await Product.find({
    _id: { $in: targetProductIds },
    is_active: true,
  });

  const created = [];

  for (const product of products) {
    const existingVariants = await Variant.find({ product: product._id })
      .sort({ createdAt: 1 })
      .select("_id name price sku");

    if (existingVariants.length >= 2) {
      await Product.updateOne(
        { _id: product._id },
        { $set: { variants: existingVariants.map((v) => v._id) } },
      );
      continue;
    }

    const basePrice = product.price || 100000;
    const baseImages = Array.isArray(product.images) ? product.images : [];
    const variantIds = [];

    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      const variant = await Variant.create({
        product: product._id,
        name: `${product.name} - ${sample.suffix}`,
        sku: `${String(product._id).slice(-6).toUpperCase()}-${i + 1}`,
        attributes: sample.attrs,
        material: sample.attrs.material || "",
        price: Math.round(basePrice * sample.mul),
        original_price: Math.round(basePrice * sample.mul * 1.1),
        images: baseImages,
        stock: 20 - i * 5,
        is_active: true,
        is_default: i === 0,
      });

      variantIds.push(variant._id);
      created.push({
        product: product.name,
        variant: variant.name,
        price: variant.price,
        sku: variant.sku,
      });
    }

    await Product.updateOne(
      { _id: product._id },
      { $set: { variants: variantIds } },
    );
  }

  console.log("Created variants:");
  console.log(JSON.stringify(created, null, 2));
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Create sample variants failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
