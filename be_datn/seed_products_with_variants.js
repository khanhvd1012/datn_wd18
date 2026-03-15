import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product_MD.js';
import Variant from './src/models/variant_MD.js';
import Category from './src/models/category_MD.js';
import Brand from './src/models/brand_MD.js';

dotenv.config();

const seedProductsWithVariants = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Tạo hoặc lấy brand mẫu
        let brand = await Brand.findOne({ name: 'Apple' });
        if (!brand) {
            brand = await Brand.create({
                name: 'Apple',
                description: 'Thương hiệu Apple',
                logo_image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab'
            });
            console.log('✅ Created brand:', brand.name);
        }

        // Helper function để tạo category
        const getOrCreateCategory = async (name, description) => {
            let category = await Category.findOne({ name });
            if (!category) {
                category = await Category.create({ name, description });
                console.log(`✅ Created category: ${name}`);
            }
            return category;
        };

        // Helper function để tạo product với variants
        const createProductWithVariants = async (productData, variantsData, category) => {
            const product = await Product.create({
                ...productData,
                category: category._id,
                brand: brand._id,
            });

            const variantIds = [];
            for (let i = 0; i < variantsData.length; i++) {
                const variantData = variantsData[i];
                // Kiểm tra xem variant đã tồn tại chưa (theo SKU)
                let variant = null;
                if (variantData.sku) {
                    variant = await Variant.findOne({ sku: variantData.sku });
                }
                
                if (!variant) {
                    variant = await Variant.create({
                        product: product._id,
                        is_default: i === 0, // Variant đầu tiên là mặc định
                        ...variantData
                    });
                }
                variantIds.push(variant._id);
            }

            await Product.findByIdAndUpdate(product._id, {
                variants: variantIds
            });

            return { product, variantCount: variantsData.length };
        };

        const productsCreated = [];

        // ========== DANH MỤC 1: CÁP SẠC NHANH ==========
        const category1 = await getOrCreateCategory(
            'Cáp sạc nhanh',
            'Cáp sạc nhanh cho điện thoại và thiết bị di động'
        );

        // Sản phẩm 1.1: Cáp Lightning
        const p1_1 = await createProductWithVariants(
            {
                name: "Cáp sạc Lightning 1m",
                slug: "cap-sac-lightning-1m-" + Date.now(),
                price: 150000,
                original_price: 200000,
                description: "Cáp sạc Lightning chính hãng Apple, hỗ trợ sạc nhanh và truyền dữ liệu, chiều dài 1m.",
                images: ["https://images.unsplash.com/photo-1580910051074-3eb694886505"],
                countInStock: 200
            },
            [
                {
                    name: "Trắng",
                    sku: "CABLE-LIGHTNING-1M-WHITE",
                    attributes: { color: "Trắng", length: "1m" },
                    price: 150000,
                    original_price: 200000,
                    stock: 100,
                    is_active: true
                },
                {
                    name: "Đen",
                    sku: "CABLE-LIGHTNING-1M-BLACK",
                    attributes: { color: "Đen", length: "1m" },
                    price: 160000,
                    original_price: 200000,
                    stock: 100,
                    is_active: true
                }
            ],
            category1
        );
        productsCreated.push({ name: p1_1.product.name, category: 'Cáp sạc nhanh', variants: p1_1.variantCount });

        // Sản phẩm 1.2: Cáp USB-C
        const p1_2 = await createProductWithVariants(
            {
                name: "Cáp sạc USB-C 2m",
                slug: "cap-sac-usbc-2m-" + Date.now(),
                price: 180000,
                original_price: 250000,
                description: "Cáp sạc USB-C hỗ trợ sạc nhanh 20W, chiều dài 2m, tương thích với nhiều thiết bị.",
                images: ["https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00"],
                countInStock: 150
            },
            [
                {
                    name: "Xanh",
                    sku: "CABLE-USBC-2M-BLUE",
                    attributes: { color: "Xanh", length: "2m" },
                    price: 180000,
                    original_price: 250000,
                    stock: 80,
                    is_active: true
                },
                {
                    name: "Đỏ",
                    sku: "CABLE-USBC-2M-RED",
                    attributes: { color: "Đỏ", length: "2m" },
                    price: 190000,
                    original_price: 250000,
                    stock: 70,
                    is_active: true
                }
            ],
            category1
        );
        productsCreated.push({ name: p1_2.product.name, category: 'Cáp sạc nhanh', variants: p1_2.variantCount });

        // ========== DANH MỤC 2: ĐẾ SẠC KHÔNG DÂY ==========
        const category2 = await getOrCreateCategory(
            'Đế sạc không dây',
            'Đế sạc không dây cho điện thoại và thiết bị di động'
        );

        // Sản phẩm 2.1: Đế sạc MagSafe
        const p2_1 = await createProductWithVariants(
            {
                name: "Đế sạc MagSafe 15W",
                slug: "de-sac-magsafe-15w-" + Date.now(),
                price: 800000,
                original_price: 1200000,
                description: "Đế sạc MagSafe chính hãng Apple, công suất 15W, tương thích với iPhone 12 trở lên.",
                images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3"],
                countInStock: 100
            },
            [
                {
                    name: "Trắng",
                    sku: "MAGSAFE-15W-WHITE",
                    attributes: { color: "Trắng", power: "15W" },
                    price: 800000,
                    original_price: 1200000,
                    stock: 50,
                    is_active: true
                },
                {
                    name: "Đen",
                    sku: "MAGSAFE-15W-BLACK",
                    attributes: { color: "Đen", power: "15W" },
                    price: 850000,
                    original_price: 1200000,
                    stock: 50,
                    is_active: true
                }
            ],
            category2
        );
        productsCreated.push({ name: p2_1.product.name, category: 'Đế sạc không dây', variants: p2_1.variantCount });

        // Sản phẩm 2.2: Đế sạc gập được
        const p2_2 = await createProductWithVariants(
            {
                name: "Đế sạc không dây gập được",
                slug: "de-sac-khong-day-gap-" + Date.now(),
                price: 600000,
                original_price: 900000,
                description: "Đế sạc không dây có thể gập lại, tiện lợi mang theo, hỗ trợ sạc nhanh 10W.",
                images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3"],
                countInStock: 80
            },
            [
                {
                    name: "Bạc",
                    sku: "WIRELESS-STAND-SILVER",
                    attributes: { color: "Bạc", foldable: "Có" },
                    price: 600000,
                    original_price: 900000,
                    stock: 40,
                    is_active: true
                },
                {
                    name: "Đen",
                    sku: "WIRELESS-STAND-BLACK",
                    attributes: { color: "Đen", foldable: "Có" },
                    price: 620000,
                    original_price: 900000,
                    stock: 40,
                    is_active: true
                }
            ],
            category2
        );
        productsCreated.push({ name: p2_2.product.name, category: 'Đế sạc không dây', variants: p2_2.variantCount });

        // ========== DANH MỤC 3: GIÁ ĐỠ CHỐNG XOAY ==========
        const category3 = await getOrCreateCategory(
            'Giá đỡ chống xoay',
            'Giá đỡ điện thoại chống xoay cho ô tô'
        );

        // Sản phẩm 3.1: Giá đỡ ô tô từ tính
        const p3_1 = await createProductWithVariants(
            {
                name: "Giá đỡ ô tô từ tính",
                slug: "gia-do-o-to-tu-tinh-" + Date.now(),
                price: 250000,
                original_price: 350000,
                description: "Giá đỡ điện thoại từ tính cho ô tô, chống rung, dễ dàng gắn và tháo.",
                images: ["https://images.unsplash.com/photo-1580913428735-bd3c269d6a82"],
                countInStock: 120
            },
            [
                {
                    name: "Đen",
                    sku: "CAR-MOUNT-BLACK",
                    attributes: { color: "Đen", type: "Từ tính" },
                    price: 250000,
                    original_price: 350000,
                    stock: 60,
                    is_active: true
                },
                {
                    name: "Xanh",
                    sku: "CAR-MOUNT-BLUE",
                    attributes: { color: "Xanh", type: "Từ tính" },
                    price: 260000,
                    original_price: 350000,
                    stock: 60,
                    is_active: true
                }
            ],
            category3
        );
        productsCreated.push({ name: p3_1.product.name, category: 'Giá đỡ chống xoay', variants: p3_1.variantCount });

        // Sản phẩm 3.2: Giá đỡ kẹp kính
        const p3_2 = await createProductWithVariants(
            {
                name: "Giá đỡ kẹp kính chắn gió",
                slug: "gia-do-kep-kinh-" + Date.now(),
                price: 300000,
                original_price: 400000,
                description: "Giá đỡ điện thoại kẹp vào kính chắn gió, điều chỉnh góc độ linh hoạt.",
                images: ["https://images.unsplash.com/photo-1580913428735-bd3c269d6a82"],
                countInStock: 100
            },
            [
                {
                    name: "Đen",
                    sku: "WINDSHIELD-MOUNT-BLACK",
                    attributes: { color: "Đen", mount: "Kẹp kính" },
                    price: 300000,
                    original_price: 400000,
                    stock: 50,
                    is_active: true
                },
                {
                    name: "Xám",
                    sku: "WINDSHIELD-MOUNT-GRAY",
                    attributes: { color: "Xám", mount: "Kẹp kính" },
                    price: 310000,
                    original_price: 400000,
                    stock: 50,
                    is_active: true
                }
            ],
            category3
        );
        productsCreated.push({ name: p3_2.product.name, category: 'Giá đỡ chống xoay', variants: p3_2.variantCount });

        // ========== DANH MỤC 4: GIÁ ĐỠ IPAD ==========
        const category4 = await getOrCreateCategory(
            'Giá đỡ iPad',
            'Giá đỡ và stand cho iPad và tablet'
        );

        // Sản phẩm 4.1: Giá đỡ iPad điều chỉnh
        const p4_1 = await createProductWithVariants(
            {
                name: "Giá đỡ iPad điều chỉnh góc",
                slug: "gia-do-ipad-dieu-chinh-" + Date.now(),
                price: 450000,
                original_price: 650000,
                description: "Giá đỡ iPad có thể điều chỉnh góc độ, phù hợp cho làm việc và giải trí.",
                images: ["https://images.unsplash.com/photo-1580913428735-bd3c269d6a82"],
                countInStock: 90
            },
            [
                {
                    name: "Xám đen",
                    sku: "IPAD-STAND-GRAY",
                    attributes: { color: "Xám đen", adjustable: "Có" },
                    price: 450000,
                    original_price: 650000,
                    stock: 45,
                    is_active: true
                },
                {
                    name: "Bạc",
                    sku: "IPAD-STAND-SILVER",
                    attributes: { color: "Bạc", adjustable: "Có" },
                    price: 470000,
                    original_price: 650000,
                    stock: 45,
                    is_active: true
                }
            ],
            category4
        );
        productsCreated.push({ name: p4_1.product.name, category: 'Giá đỡ iPad', variants: p4_1.variantCount });

        // Sản phẩm 4.2: Stand iPad gấp gọn
        const p4_2 = await createProductWithVariants(
            {
                name: "Stand iPad gấp gọn",
                slug: "stand-ipad-gap-gon-" + Date.now(),
                price: 350000,
                original_price: 500000,
                description: "Stand iPad có thể gấp gọn, nhẹ và tiện lợi mang theo.",
                images: ["https://images.unsplash.com/photo-1580913428735-bd3c269d6a82"],
                countInStock: 110
            },
            [
                {
                    name: "Đen",
                    sku: "IPAD-FOLD-STAND-BLACK",
                    attributes: { color: "Đen", foldable: "Có" },
                    price: 350000,
                    original_price: 500000,
                    stock: 55,
                    is_active: true
                },
                {
                    name: "Trắng",
                    sku: "IPAD-FOLD-STAND-WHITE",
                    attributes: { color: "Trắng", foldable: "Có" },
                    price: 360000,
                    original_price: 500000,
                    stock: 55,
                    is_active: true
                }
            ],
            category4
        );
        productsCreated.push({ name: p4_2.product.name, category: 'Giá đỡ iPad', variants: p4_2.variantCount });

        // ========== DANH MỤC 5: PIN DỰ PHÒNG ==========
        const category5 = await getOrCreateCategory(
            'Pin dự phòng',
            'Pin dự phòng và sạc dự phòng cho điện thoại'
        );

        // Sản phẩm 5.1: Pin dự phòng 20000mAh
        const p5_1 = await createProductWithVariants(
            {
                name: "Pin dự phòng 20000mAh",
                slug: "pin-du-phong-20000mah-" + Date.now(),
                price: 600000,
                original_price: 800000,
                description: "Pin dự phòng dung lượng cao 20000mAh, sạc nhanh, hỗ trợ nhiều thiết bị.",
                images: ["https://images.unsplash.com/photo-1580894732444-8ecded7900cd"],
                countInStock: 80
            },
            [
                {
                    name: "Đen",
                    sku: "POWERBANK-20K-BLACK",
                    attributes: { color: "Đen", capacity: "20000mAh" },
                    price: 600000,
                    original_price: 800000,
                    stock: 40,
                    is_active: true
                },
                {
                    name: "Xanh",
                    sku: "POWERBANK-20K-BLUE",
                    attributes: { color: "Xanh", capacity: "20000mAh" },
                    price: 620000,
                    original_price: 800000,
                    stock: 40,
                    is_active: true
                }
            ],
            category5
        );
        productsCreated.push({ name: p5_1.product.name, category: 'Pin dự phòng', variants: p5_1.variantCount });

        // Sản phẩm 5.2: Pin dự phòng MagSafe
        const p5_2 = await createProductWithVariants(
            {
                name: "Pin dự phòng MagSafe 5000mAh",
                slug: "pin-magsafe-5000mah-" + Date.now(),
                price: 1200000,
                original_price: 1500000,
                description: "Pin dự phòng MagSafe cho iPhone, dung lượng 5000mAh, sạc không dây.",
                images: ["https://images.unsplash.com/photo-1606813902914-5dcf0aeb1a48"],
                countInStock: 60
            },
            [
                {
                    name: "Trắng",
                    sku: "MAGSAFE-BANK-WHITE",
                    attributes: { color: "Trắng", capacity: "5000mAh", type: "MagSafe" },
                    price: 1200000,
                    original_price: 1500000,
                    stock: 30,
                    is_active: true
                },
                {
                    name: "Đen",
                    sku: "MAGSAFE-BANK-BLACK",
                    attributes: { color: "Đen", capacity: "5000mAh", type: "MagSafe" },
                    price: 1250000,
                    original_price: 1500000,
                    stock: 30,
                    is_active: true
                }
            ],
            category5
        );
        productsCreated.push({ name: p5_2.product.name, category: 'Pin dự phòng', variants: p5_2.variantCount });

        // ========== DANH MỤC 6: TAI NGHE BLUETOOTH ==========
        const category6 = await getOrCreateCategory(
            'Tai nghe Bluetooth',
            'Tai nghe không dây Bluetooth'
        );

        // Sản phẩm 6.1: AirPods Pro 2
        const p6_1 = await createProductWithVariants(
            {
                name: "AirPods Pro 2",
                slug: "airpods-pro-2-" + Date.now(),
                price: 5000000,
                original_price: 6000000,
                description: "Tai nghe AirPods Pro 2 với chống ồn chủ động, âm thanh không gian và pin 30 giờ.",
                images: ["https://images.unsplash.com/photo-1518449037947-7d1b2c1f3a8b"],
                countInStock: 50
            },
            [
                {
                    name: "Trắng",
                    sku: "AIRPODS-PRO2-WHITE",
                    attributes: { color: "Trắng", model: "Pro 2" },
                    price: 5000000,
                    original_price: 6000000,
                    stock: 25,
                    is_active: true
                },
                {
                    name: "Đen",
                    sku: "AIRPODS-PRO2-BLACK",
                    attributes: { color: "Đen", model: "Pro 2" },
                    price: 5200000,
                    original_price: 6000000,
                    stock: 25,
                    is_active: true
                }
            ],
            category6
        );
        productsCreated.push({ name: p6_1.product.name, category: 'Tai nghe Bluetooth', variants: p6_1.variantCount });

        // Sản phẩm 6.2: AirPods 3
        const p6_2 = await createProductWithVariants(
            {
                name: "AirPods 3",
                slug: "airpods-3-" + Date.now(),
                price: 3500000,
                original_price: 4500000,
                description: "Tai nghe AirPods 3 với thiết kế mới, âm thanh không gian và pin 30 giờ.",
                images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad"],
                countInStock: 70
            },
            [
                {
                    name: "Trắng",
                    sku: "AIRPODS-3-WHITE",
                    attributes: { color: "Trắng", model: "3" },
                    price: 3500000,
                    original_price: 4500000,
                    stock: 35,
                    is_active: true
                },
                {
                    name: "Xanh",
                    sku: "AIRPODS-3-BLUE",
                    attributes: { color: "Xanh", model: "3" },
                    price: 3600000,
                    original_price: 4500000,
                    stock: 35,
                    is_active: true
                }
            ],
            category6
        );
        productsCreated.push({ name: p6_2.product.name, category: 'Tai nghe Bluetooth', variants: p6_2.variantCount });

        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📦 Tổng kết sản phẩm đã tạo:\n');
        
        productsCreated.forEach((p, index) => {
            console.log(`${index + 1}. ${p.name}`);
            console.log(`   Danh mục: ${p.category}`);
            console.log(`   Variants: ${p.variants}`);
        });

        console.log(`\n✅ Tổng cộng: ${productsCreated.length} sản phẩm`);
        console.log(`✅ Tổng cộng: ${productsCreated.reduce((sum, p) => sum + p.variants, 0)} variants`);
        console.log('\n💡 Bạn có thể test variants trên trang chủ ngay bây giờ!');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProductsWithVariants();
