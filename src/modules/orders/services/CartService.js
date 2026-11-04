

const catalogModule = require("../../catalog/");
const CartModel = require("../model/CartModel");

class CartService {
  async findCartItem(customerId, bookId = null) {
    const whereCondition = { customerID: customerId };

    // check if bookId is nullable/undefined or not
    if (bookId !== null && bookId !== undefined) {
      whereCondition.bookID = bookId;
    }

    return await CartModel.findAll({
      where: whereCondition,
    });
  }

  async createCartItem(customerId, bookId, quantity) {
    return await CartModel.create({
      customerID: customerId,
      bookID: bookId,
      quantity: quantity,
    });
  }

  async updateItemQuantity(customerId, bookId, newQuantity) {
    const [affectedRows] = await CartModel.update(
      { quantity: newQuantity },
      {
        where: {
          customerID: customerId,
          bookID: bookId,
        },
      },
    );
    return affectedRows > 0;
  }

  async removeCartItem(customerId, bookId) {
    const deletedCount = await CartModel.destroy({
      where: {
        customerID: customerId,
        bookID: bookId,
      },
    });

    return deletedCount > 0;
  }

  async removeCart(customerId) {
    const deletedCount = await CartModel.destroy({
      where: {
        customerID: customerId,
      },
    });
    return deletedCount > 0;
  }

  async getCustomerCart(customerId) {
    const cartItems = await CartModel.findAll({
      attributes: ["bookID", "quantity"],
      where: {
        customerID: customerId,
      },
      order: [["bookID", "ASC"]],
      raw: true,
    });

    if (!cartItems.length) return null;

    // get book prices from catalog module
    const bookIDs = cartItems.map((item) => item.bookID);
    const books = await catalogModule.getPrices(bookIDs); // return [{ bookID, title, price }]

    // create a map of bookID to book info for easy lookup
    const bookMap = new Map(books.map((b) => [b.bookID, b]));

    let totalPrice = 0;
    const result = cartItems.map((item) => {
      const bookInfo = bookMap.get(item.bookID) || {
        title: "Book not found",
        price: 0,
      };
      totalPrice += bookInfo.price * item.quantity;

      return {
        bookID: item.bookID,
        quantity: item.quantity,
        Book: { title: bookInfo.title, price: bookInfo.price },
      };
    });

    return { result, totalPrice };
  }
}

module.exports = new CartService();
