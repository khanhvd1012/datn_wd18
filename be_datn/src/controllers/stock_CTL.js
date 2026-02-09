import mongoose from 'mongoose';
import stock_MD from '../models/stock_MD.js';
import product_MD from '../models/product_MD.js';

// Lấy tất cả stock items
export const getAllStocks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, product_id } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (product_id) query.product = product_id;

        const stocks = await stock_MD.find(query)
            .populate('product', 'name slug')
            .populate('variant', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await stock_MD.countDocuments(query);

        res.status(200).json({
            success: true,
            data: stocks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách kho hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Lấy stock theo ID
export const getStockById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const stock = await stock_MD.findById(req.params.id)
            .populate('product', 'name slug description')
            .populate('variant', 'name');

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy kho hàng'
            });
        }

        res.status(200).json({
            success: true,
            data: stock
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin kho hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Tạo stock mới
export const createStock = async (req, res) => {
    try {
        // Kiểm tra product có tồn tại không
        const product = await product_MD.findById(req.body.product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại'
            });
        }

        // Kiểm tra đã có stock cho product/variant này chưa
        const existingStock = await stock_MD.findOne({
            product: req.body.product,
            variant: req.body.variant || null
        });

        if (existingStock) {
            return res.status(400).json({
                success: false,
                message: 'Kho hàng cho sản phẩm này đã tồn tại'
            });
        }

        const stock = await stock_MD.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Tạo kho hàng thành công',
            data: stock
        });
    } catch (error) {
        console.error('Lỗi khi tạo kho hàng:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Lỗi xác thực dữ liệu',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Cập nhật stock
export const updateStock = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const stock = await stock_MD.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Kho hàng không tồn tại'
            });
        }

        // Nếu cập nhật quantity và có last_restocked
        if (req.body.quantity && req.body.quantity > stock.quantity) {
            req.body.last_restocked = new Date();
        }

        const updated = await stock_MD.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('product', 'name slug')
         .populate('variant', 'name');

        res.status(200).json({
            success: true,
            message: 'Cập nhật kho hàng thành công',
            data: updated
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật kho hàng:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Lỗi xác thực dữ liệu',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Xóa stock
export const deleteStock = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const stock = await stock_MD.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Kho hàng không tồn tại'
            });
        }

        await stock_MD.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Xóa kho hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa kho hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Cập nhật số lượng kho (nhập/xuất kho)
export const updateStockQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity_change, type, notes } = req.body; // type: 'import' hoặc 'export'

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const stock = await stock_MD.findById(id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Kho hàng không tồn tại'
            });
        }

        if (type === 'import') {
            stock.quantity += Math.abs(quantity_change);
            stock.last_restocked = new Date();
        } else if (type === 'export') {
            const change = Math.abs(quantity_change);
            if (stock.quantity - stock.reserved_quantity < change) {
                return res.status(400).json({
                    success: false,
                    message: 'Số lượng xuất vượt quá số lượng có sẵn'
                });
            }
            stock.quantity -= change;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Loại cập nhật không hợp lệ (phải là import hoặc export)'
            });
        }

        if (notes) {
            stock.notes = notes;
        }

        await stock.save();

        res.status(200).json({
            success: true,
            message: `Cập nhật kho hàng thành công (${type})`,
            data: stock
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng kho:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Đặt hàng trước (reserve stock)
export const reserveStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const stock = await stock_MD.findById(id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Kho hàng không tồn tại'
            });
        }

        const available = stock.quantity - stock.reserved_quantity;
        if (available < quantity) {
            return res.status(400).json({
                success: false,
                message: `Không đủ hàng. Số lượng có sẵn: ${available}`
            });
        }

        stock.reserved_quantity += quantity;
        await stock.save();

        res.status(200).json({
            success: true,
            message: 'Đặt hàng trước thành công',
            data: stock
        });
    } catch (error) {
        console.error('Lỗi khi đặt hàng trước:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};
