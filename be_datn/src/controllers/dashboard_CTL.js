import mongoose from 'mongoose';
import product_MD from '../models/product_MD.js';
import brand_MD from '../models/brand_MD.js';
import category_MD from '../models/category_MD.js';
import stock_MD from '../models/stock_MD.js';
import voucher_MD from '../models/voucher_MD.js';
import news_MD from '../models/news_MD.js';
import contact_MD from '../models/contact_MD.js';

// Lấy thống kê tổng quan
export const getDashboardStats = async (req, res) => {
    try {
        // Thống kê sản phẩm
        const totalProducts = await product_MD.countDocuments();
        const productsByBrand = await product_MD.aggregate([
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $lookup: { from: 'brands', localField: '_id', foreignField: '_id', as: 'brandInfo' } },
            { $unwind: { path: '$brandInfo', preserveNullAndEmptyArrays: true } },
            { $project: { brandName: '$brandInfo.name', count: 1 } }
        ]);

        // Thống kê kho hàng
        const totalStockItems = await stock_MD.countDocuments();
        const stockStats = await stock_MD.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalReserved: { $sum: '$reserved_quantity' }
                }
            }
        ]);

        const lowStockItems = await stock_MD.countDocuments({
            status: 'low_stock'
        });
        const outOfStockItems = await stock_MD.countDocuments({
            status: 'out_of_stock'
        });

        // Thống kê voucher
        const totalVouchers = await voucher_MD.countDocuments();
        const activeVouchers = await voucher_MD.countDocuments({ status: 'active' });
        const expiredVouchers = await voucher_MD.countDocuments({ status: 'expired' });
        const voucherUsage = await voucher_MD.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsed: { $sum: '$used_count' },
                    totalLimit: { $sum: '$usage_limit' }
                }
            }
        ]);

        // Thống kê thương hiệu và danh mục
        const totalBrands = await brand_MD.countDocuments();
        const totalCategories = await category_MD.countDocuments();

        // Thống kê tin tức
        const totalNews = await news_MD.countDocuments();
        const recentNews = await news_MD.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title createdAt')
            .populate('author', 'username');

        // Thống kê liên hệ
        const totalContacts = await contact_MD.countDocuments();
        const recentContacts = await contact_MD.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username email createdAt');

        // Thống kê theo thời gian (7 ngày gần nhất)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const productsCreatedLast7Days = await product_MD.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        const vouchersCreatedLast7Days = await voucher_MD.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                products: {
                    total: totalProducts,
                    createdLast7Days: productsCreatedLast7Days,
                    byBrand: productsByBrand
                },
                stock: {
                    totalItems: totalStockItems,
                    lowStock: lowStockItems,
                    outOfStock: outOfStockItems,
                    stats: stockStats
                },
                vouchers: {
                    total: totalVouchers,
                    active: activeVouchers,
                    expired: expiredVouchers,
                    createdLast7Days: vouchersCreatedLast7Days,
                    usage: voucherUsage[0] || { totalUsed: 0, totalLimit: null }
                },
                brands: {
                    total: totalBrands
                },
                categories: {
                    total: totalCategories
                },
                news: {
                    total: totalNews,
                    recent: recentNews
                },
                contacts: {
                    total: totalContacts,
                    recent: recentContacts
                }
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Lấy thống kê chi tiết về kho hàng
export const getStockDashboard = async (req, res) => {
    try {
        const stockByStatus = await stock_MD.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalReserved: { $sum: '$reserved_quantity' },
                    totalAvailable: { $sum: { $subtract: ['$quantity', '$reserved_quantity'] } }
                }
            }
        ]);

        const lowStockProducts = await stock_MD.find({
            status: 'low_stock'
        })
        .populate('product', 'name slug')
        .populate('variant', 'name')
        .sort({ quantity: 1 })
        .limit(10);

        const outOfStockProducts = await stock_MD.find({
            status: 'out_of_stock'
        })
        .populate('product', 'name slug')
        .populate('variant', 'name')
        .limit(10);

        res.status(200).json({
            success: true,
            data: {
                byStatus: stockByStatus,
                lowStockProducts,
                outOfStockProducts
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê kho hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Lấy thống kê chi tiết về voucher
export const getVoucherDashboard = async (req, res) => {
    try {
        const voucherByStatus = await voucher_MD.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalUsed: { $sum: '$used_count' }
                }
            }
        ]);

        const topUsedVouchers = await voucher_MD.find()
            .sort({ used_count: -1 })
            .limit(10)
            .select('code name used_count usage_limit discount_type discount_value');

        const upcomingExpiredVouchers = await voucher_MD.find({
            end_date: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            status: 'active'
        })
        .sort({ end_date: 1 })
        .limit(10)
        .select('code name end_date used_count usage_limit');

        res.status(200).json({
            success: true,
            data: {
                byStatus: voucherByStatus,
                topUsed: topUsedVouchers,
                upcomingExpired: upcomingExpiredVouchers
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê voucher:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};
