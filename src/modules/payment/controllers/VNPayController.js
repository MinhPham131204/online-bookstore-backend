const VNPayService = require('../services');

class VNPayController {
    // [POST] /payment/vnpay
    async payment(req, res) {
        try {
            const paymentUrl = await VNPayService.createPaymentUrl(req);
            if (paymentUrl.statusCode === "200") {
                return res.status(200).json(paymentUrl.url);
            } else {
                return res.status(paymentUrl.statusCode).json({ message: paymentUrl.message });
            }
        } catch (error) {
            console.error('Error in VNPayController.payment:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    // [GET] /payment/vnpay/result
    async getResult(req, res) {
        try {
            const result = await VNPayService.checkTransaction(req.query);
            return res.status(result.statusCode).json({ message: result.message || "Transaction processed successfully" });
        }
        catch (error) {
            console.error('Error in VNPayController.getResult:', error);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new VNPayController();