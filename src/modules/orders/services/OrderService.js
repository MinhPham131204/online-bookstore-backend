const CartService = require("./CartService");
const userModule = require("../../user");

const OrderModel = require("../model/OrderModel");

class OrderService {
    async getOrderInfo(userId) {
        const userInfo = await userModule.getUserInfo(userId);
    
        userInfo.cart = await CartService.findCartItem(userId);
    
        return userInfo;
    }

    async createOrder(orderData) {
        const order = await OrderModel.create(orderData);
        
        const cart = await CartService.findCartItem(req.user, null);

        // create order details for each item in the cart
        const orderDetails = await Promise.all(
            cart.map(async (item) => {
                const book = await Book.findOne({ where: { bookID: item.bookID } });
                if (!book) {
                    throw new Error(`Book with ID ${item.bookID} not found`);
                }

                return {
                    orderID: order.orderID,
                    bookID: item.bookID,
                    quantity: item.quantity,
                    price: book.price * item.quantity,
                };
            })
        );

        // save the order details to the database
        await OrderDetailModel.bulkCreate(orderDetails);

        // clear the cart after creating the order
        await CartService.removeCart(req.user);

        return order;
    }

    async getOrderList(userId) {
        const result = await OrderModel.findAll({
            where: {customerID: userId},
            include: [
                {
                    model: OrderDetailModel,
                    attributes: ['quantity', 'price'],
                    include: [
                        {
                            model: Book,
                            attributes: ['title'],
                        }
                    ]
                }
            ]
        })

        return result;
    }

    async cancelOrder(orderId) {
        const [affectedRows] = await OrderModel.update(
            { deliveryStatus: 'Canceled' },
            { where: { orderID: orderId } }
        );

        return affectedRows > 0;
    }
}

module.exports = new OrderService();