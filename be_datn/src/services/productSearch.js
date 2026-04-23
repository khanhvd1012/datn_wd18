import product_MD from "../models/product_MD.js";

export const findProducts = async (query) => {
  const products = await product_MD.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
    is_active: true,
  })
    .limit(4)
    .lean();

  return products;
};