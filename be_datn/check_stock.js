import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '/Users/thinh/Documents/DATN/datn_wd18/be_datn/.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = mongoose.model('Products', new mongoose.Schema({ name: String, countInStock: Number, variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }] }, { strict: false }));
  const Variant = mongoose.model('Variant', new mongoose.Schema({ name: String, stock: Number }, { strict: false }));
  
  const products = await Product.find().populate('variants');
  for (let p of products) {
    if (p.variants && p.variants.length > 0) {
      const vStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
      console.log(`Product: ${p.name} | p.countInStock: ${p.countInStock} | variant total stock: ${vStock}`);
    } else {
      console.log(`Product: ${p.name} | p.countInStock: ${p.countInStock}`);
    }
  }
  
  process.exit(0);
});
