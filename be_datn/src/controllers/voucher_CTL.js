import mongoose from 'mongoose';
import voucher_MD from '../models/voucher_MD.js';

// Lấy tất cả vouchers
export const getAllVouchers = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, code } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (code) query.code = { $regex: code, $options: 'i' };

        const vouchers = await voucher_MD.find(query)
            .populate('applicable_products', 'name slug')
            .populate('applicable_categories', 'name')
            .populate('applicable_brands', 'name')
            .populate('created_by', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await voucher_MD.countDocuments(query);

        res.status(200).json({
            success: true,
            data: vouchers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Lấy voucher theo ID
export const getVoucherById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const voucher = await voucher_MD.findById(req.params.id)
            .populate('applicable_products', 'name slug')
            .populate('applicable_categories', 'name')
            .populate('applicable_brands', 'name')
            .populate('created_by', 'username');

        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy voucher'
            });
        }

        res.status(200).json({
            success: true,
            data: voucher
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin voucher:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Lấy voucher theo code (cho user sử dụng)
export const getVoucherByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const { order_amount } = req.query; // Giá trị đơn hàng để kiểm tra min_order_amount

        const voucher = await voucher_MD.findOne({ 
            code: code.toUpperCase(),
            status: 'active'
        })
        .populate('applicable_products', 'name slug')
        .populate('applicable_categories', 'name')
        .populate('applicable_brands', 'name');

        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Mã voucher không tồn tại hoặc đã hết hạn'
            });
        }

        // Kiểm tra ngày hiệu lực
        const now = new Date();
        if (voucher.start_date > now || voucher.end_date < now) {
            return res.status(400).json({
                success: false,
                message: 'Mã voucher chưa có hiệu lực hoặc đã hết hạn'
            });
        }

        // Kiểm tra số lần sử dụng
        if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
            return res.status(400).json({
                success: false,
                message: 'Mã voucher đã hết lượt sử dụng'
            });
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (order_amount && voucher.min_order_amount > parseFloat(order_amount)) {
            return res.status(400).json({
                success: false,
                message: `Đơn hàng tối thiểu phải từ ${voucher.min_order_amount.toLocaleString('vi-VN')}đ để sử dụng voucher này`
            });
        }

        res.status(200).json({
            success: true,
            data: voucher
        });
    } catch (error) {
        console.error('Lỗi khi lấy voucher theo code:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Tạo voucher mới
export const createVoucher = async (req, res) => {
    try {
        // Kiểm tra code đã tồn tại chưa
        const existingVoucher = await voucher_MD.findOne({ 
            code: req.body.code.toUpperCase() 
        });

        if (existingVoucher) {
            return res.status(400).json({
                success: false,
                message: 'Mã voucher đã tồn tại'
            });
        }

        // Validate discount_value
        if (req.body.discount_type === 'percentage' && req.body.discount_value > 100) {
            return res.status(400).json({
                success: false,
                message: 'Phần trăm giảm giá không được vượt quá 100%'
            });
        }

        // Validate dates
        if (new Date(req.body.start_date) >= new Date(req.body.end_date)) {
            return res.status(400).json({
                success: false,
                message: 'Ngày kết thúc phải sau ngày bắt đầu'
            });
        }

        // Gán created_by nếu có user
        if (req.user) {
            req.body.created_by = req.user._id;
        }

        const voucher = await voucher_MD.create({
            ...req.body,
            code: req.body.code.toUpperCase()
        });

        res.status(201).json({
            success: true,
            message: 'Tạo voucher thành công',
            data: voucher
        });
    } catch (error) {
        console.error('Lỗi khi tạo voucher:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Lỗi xác thực dữ liệu',
                errors: validationErrors
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Mã voucher đã tồn tại'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Cập nhật voucher
export const updateVoucher = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const voucher = await voucher_MD.findById(req.params.id);
        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher không tồn tại'
            });
        }

        // Nếu cập nhật code, kiểm tra trùng
        if (req.body.code && req.body.code.toUpperCase() !== voucher.code) {
            const existingVoucher = await voucher_MD.findOne({ 
                code: req.body.code.toUpperCase(),
                _id: { $ne: req.params.id }
            });

            if (existingVoucher) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã voucher đã tồn tại'
                });
            }
            req.body.code = req.body.code.toUpperCase();
        }

        // Validate discount_value
        if (req.body.discount_type === 'percentage' && req.body.discount_value > 100) {
            return res.status(400).json({
                success: false,
                message: 'Phần trăm giảm giá không được vượt quá 100%'
            });
        }

        // Validate dates
        const startDate = req.body.start_date || voucher.start_date;
        const endDate = req.body.end_date || voucher.end_date;
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'Ngày kết thúc phải sau ngày bắt đầu'
            });
        }

        const updated = await voucher_MD.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('applicable_products', 'name slug')
        .populate('applicable_categories', 'name')
        .populate('applicable_brands', 'name')
        .populate('created_by', 'username');

        res.status(200).json({
            success: true,
            message: 'Cập nhật voucher thành công',
            data: updated
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật voucher:', error);
        
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

// Xóa voucher
export const deleteVoucher = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const voucher = await voucher_MD.findById(req.params.id);
        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher không tồn tại'
            });
        }

        await voucher_MD.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Xóa voucher thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Sử dụng voucher (tăng used_count)
export const useVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const voucher = await voucher_MD.findById(id);
        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher không tồn tại'
            });
        }

        // Kiểm tra điều kiện sử dụng
        const now = new Date();
        if (voucher.start_date > now || voucher.end_date < now) {
            return res.status(400).json({
                success: false,
                message: 'Voucher chưa có hiệu lực hoặc đã hết hạn'
            });
        }

        if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
            return res.status(400).json({
                success: false,
                message: 'Voucher đã hết lượt sử dụng'
            });
        }

        voucher.used_count += 1;
        await voucher.save();

        res.status(200).json({
            success: true,
            message: 'Sử dụng voucher thành công',
            data: voucher
        });
    } catch (error) {
        console.error('Lỗi khi sử dụng voucher:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};

// Toggle status voucher
export const toggleVoucherStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const voucher = await voucher_MD.findById(id);
        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Voucher không tồn tại'
            });
        }

        // Chỉ toggle giữa active và inactive, không toggle expired
        if (voucher.status === 'expired') {
            return res.status(400).json({
                success: false,
                message: 'Không thể thay đổi trạng thái voucher đã hết hạn'
            });
        }

        voucher.status = voucher.status === 'active' ? 'inactive' : 'active';
        await voucher.save();

        res.status(200).json({
            success: true,
            message: 'Thay đổi trạng thái voucher thành công',
            data: voucher
        });
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái voucher:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message
        });
    }
};
