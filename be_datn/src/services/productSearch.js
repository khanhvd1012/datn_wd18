import product_MD from "../models/product_MD.js";

export const findProducts = async (query) => {
  const keyword = query.toLowerCase();

  const products = await product_MD.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
    is_active: true,
  })
    .limit(4)
    .lean();

  return products;
};