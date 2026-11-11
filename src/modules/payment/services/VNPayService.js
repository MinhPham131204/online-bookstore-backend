const { updateOrderInfo, findOrderById } = require('../orders');

const { VNPay, ignoreLogger, ProductCode, VnpLocale } = require('vnpay');

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_SECURE_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    loggerFn: ignoreLogger,
});

class VNPayService {
    async createPaymentUrl(reqInfo) {
        const { orderID, totalPrice } = reqInfo.body;

        const order = await findOrderById(orderID);
        
        if (!order) {
            return {
                statusCode: "404",
                message: "Order not found",
            }
        }

        const now = new Date();
        const expireDate = new Date(now.getTime() + 15 * 60 * 1000);

        const ipAddr = reqInfo.headers['x-forwarded-for'] ||
                reqInfo.connection.remoteAddress ||
                reqInfo.socket.remoteAddress ||
                reqInfo.ip;

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_TxnRef: order.orderID.toString(),
            vnp_OrderInfo: `Thanh toán đơn hàng ${order.orderID}`,
            vnp_Amount: totalPrice,
            vnp_Locale: VnpLocale.VN,
            vnp_ReturnUrl: 'http://localhost:5000/payment/vnpay-return', // frontend page URL => redirect to this page after payment
            vnp_IpAddr: ipAddr,
            vnp_OrderType: ProductCode.Other,
            vnp_CreateDate: dateFormat(now),
            vnp_ExpireDate: dateFormat(expireDate),
        });

        return {
            statusCode: "200",
            url: paymentUrl,
        }
    }

    async checkTransaction(info) {
        const verifyData = vnpay.verifyIpnCall(info);

        if (!verifyData.isChecksumSuccess) {
            return {
                statusCode: "400",
                message: "Invalid checksum",
            };
        }

        const { vnp_TxnRef, vnp_ResponseCode, vnp_Amount } = info;

        const order = await findOrderById(vnp_TxnRef);
        if (!order) {
            return {
                statusCode: "404",
                message: "Order not found",
            }
        }

        if (order.totalPrice !== Number(vnp_Amount) / 100) {
            return {
                statusCode: "400",
                message: "Amount mismatch",
            }   
        }

        if (order.status === 'PAID') {
            return {
                statusCode: "400",
                message: "Order already paid",
            }
        }

        if (vnp_ResponseCode === '00') { // Payment successful
            await updateOrderInfo(vnp_TxnRef, { 
                paymentDate: sequelize.literal('GETDATE()'),
                status: 'PAID'
            });
        } else {
            // Payment failed
            await updateOrderInfo(vnp_TxnRef, { status: 'FAILED' });
        }

        return {
            statusCode: "200",
            message: "Transaction processed successfully",
        };
    }
}

module.exports = new VNPayService();