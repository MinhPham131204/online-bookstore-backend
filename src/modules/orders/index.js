const OrderService = require('./services/OrderService');

module.exports = {
    updateOrderInfo: async (orderId, object) => {
        return await OrderService.updateOrderInfo(orderId, object);
    },
    findOrderById: async (orderId) => {
        return await OrderService.findOrderById(orderId);
    }
}