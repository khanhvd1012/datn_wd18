import nodemailer from "nodemailer";

export const sendOrderMail = async ({
    to,
    order
}) => {
    try {

        console.log(process.env.MAIL_USER);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const itemsHtml = order.order_items.map((item, index) => {
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.product_id}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString("vi-VN")}₫</td>
                </tr>
            `;
        }).join("");

        const html = `
<div style="
    background:#f4f6f8;
    padding:40px 0;
    font-family:Arial,sans-serif;
">
    <div style="
        max-width:700px;
        margin:auto;
        background:#ffffff;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 4px 20px rgba(0,0,0,0.08);
    ">

        <!-- HEADER -->
        <div style="
            background:linear-gradient(135deg,#d70018,#ff4d4f);
            padding:30px;
            text-align:center;
            color:white;
        ">
            <h1 style="
                margin:0;
                font-size:30px;
            ">
                🎉 Đặt hàng thành công
            </h1>

            <p style="
                margin-top:10px;
                font-size:15px;
                opacity:0.9;
            ">
                Cảm ơn bạn đã mua hàng tại hệ thống của chúng tôi
            </p>
        </div>

        <!-- BODY -->
        <div style="padding:30px;">

            <div style="
                background:#fff5f5;
                border-left:5px solid #d70018;
                padding:16px;
                border-radius:8px;
                margin-bottom:24px;
            ">
                <p style="margin:0;font-size:15px;">
                    <strong>Mã đơn hàng:</strong>
                    #${order._id}
                </p>
            </div>

            <h2 style="
                color:#222;
                margin-bottom:20px;
            ">
                🛒 Chi tiết đơn hàng
            </h2>
<!-- SHIPPING INFO -->
<div style="
    background:#f9fafb;
    border:1px solid #e5e7eb;
    border-radius:12px;
    padding:20px;
    margin-bottom:24px;
">

    <h3 style="
        margin-top:0;
        margin-bottom:16px;
        color:#111827;
    ">
        🚚 Thông tin giao hàng
    </h3>

    <p style="margin:8px 0;color:#374151;">
        <strong>Người nhận:</strong>
        ${order.shipping_info?.name || ""}
    </p>

    <p style="margin:8px 0;color:#374151;">
        <strong>Số điện thoại:</strong>
        ${order.shipping_info?.phone || ""}
    </p>

    <p style="margin:8px 0;color:#374151;">
        <strong>Email:</strong>
        ${order.shipping_info?.email || ""}
    </p>

    <p style="margin:8px 0;color:#374151;">
        <strong>Địa chỉ:</strong>
        ${order.shipping_info?.address || ""}
    </p>

</div>
            <table style="
                width:100%;
                border-collapse:collapse;
                overflow:hidden;
                border-radius:10px;
            ">
                <thead>
                    <tr style="
                        background:#d70018;
                        color:white;
                    ">
                        <th style="padding:14px;text-align:left;">
                            Sản phẩm
                        </th>

                        <th style="padding:14px;text-align:center;">
                            SL
                        </th>

                        <th style="padding:14px;text-align:right;">
                            Giá
                        </th>
                    </tr>
                </thead>

                <tbody>
                    ${order.order_items.map(item => `
                        <tr style="
                            border-bottom:1px solid #eee;
                        ">
                            <td style="
                                padding:16px;
                                font-size:14px;
                                color:#333;
                            ">
                                ${item.name}
                            </td>

                            <td style="
                                padding:16px;
                                text-align:center;
                                font-weight:bold;
                            ">
                                ${item.quantity}
                            </td>

                            <td style="
                                padding:16px;
                                text-align:right;
                                color:#d70018;
                                font-weight:bold;
                            ">
                                ${item.price.toLocaleString("vi-VN")}₫
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <!-- TOTAL -->
            <div style="
                margin-top:30px;
                background:#fafafa;
                padding:20px;
                border-radius:12px;
            ">
                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:10px;
                ">
                    <span style="color:#666;">
                        Tổng thanh toán
                    </span>

                    <span style="
                        color:#d70018;
                        font-size:24px;
                        font-weight:bold;
                    ">
                        ${order.total.toLocaleString("vi-VN")}₫
                    </span>
                </div>
            </div>

            <!-- INFO -->
            <div style="
                margin-top:30px;
                font-size:14px;
                color:#666;
                line-height:1.8;
            ">
                <p>
                    ✔ Đơn hàng của bạn đang được xử lý.
                </p>

                <p>
                    ✔ Chúng tôi sẽ liên hệ giao hàng sớm nhất.
                </p>

                <p>
                    Nếu có thắc mắc vui lòng liên hệ hỗ trợ khách hàng.
                </p>
            </div>

        </div>

        <!-- FOOTER -->
        <div style="
            background:#111827;
            color:#9ca3af;
            text-align:center;
            padding:20px;
            font-size:13px;
        ">
            © 2026 DATN WD-18 Ecommerce System
        </div>

    </div>
</div>
`;

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: "Xác nhận đơn hàng",
            html
        });

        console.log("MAIL SENT:", info.response);

    } catch (error) {

        console.error(
            "SEND MAIL ERROR:",
            error
        );
    }
};