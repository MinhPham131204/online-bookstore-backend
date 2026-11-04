const CartService = require('../services/CartService');

class CartController {
  // [POST] /cart/items
  async addBook(req, res) {
    try {
      const { bookID, quantity } = req.body;
      const customerId = req.user;

      const existingCartItem = await CartService.findCartItem(customerId, bookID);

      if (existingCartItem.length === 0) {
        await CartService.createCartItem(customerId, bookID, quantity);
      } else {
        const newQuantity = existingCartItem[0].quantity + quantity;
        await CartService.updateItemQuantity(customerId, bookID, newQuantity);
      }

      return res.status(201).json({ message: 'Book added to cart successfully' });
    } catch (error) {
      console.error('Error in addBook:', error);
      return res.status(500).json('Server error');
    }
  }

  // [PUT] /cart/items/:id
  async updateBook(req, res) {
    try {
      const { quantity } = req.body;
      const customerId = req.user;
      const bookId = req.params.id;

      const updated = await CartService.updateItemQuantity(customerId, bookId, quantity);

      if (updated) {
        return res.status(200).json({ message: 'Cart item updated successfully' });
      } else {
        return res.status(404).json({ error: 'Cart item not found' });
      }
    } catch (error) {
      console.error('Error in updateBook:', error);
      return res.status(500).json('Server error');
    }
  }

  // [GET] /carts
  async getAll(req, res) {
    try {
      const customerId = req.user;

      const cartData = await CartService.getCustomerCart(customerId);

      if (cartData) {
        return res.status(200).json(cartData);
      } else {
        return res.status(404).json({ error: '404 Not Found' });
      }
    } catch (err) {
      console.error('Error in getAll Cart:', err);
      return res.status(500).json('Server error');
    }
  }

  // [DELETE] /carts/:id
  async removeBook(req, res) {
    try {
      const customerId = req.user;
      const bookId = req.params.id;

      const removed = await CartService.removeCartItem(customerId, bookId);
      if (removed) {
        return res.status(200).json({ message: 'Cart item removed successfully' });
      } else {
        return res.status(404).json({ error: 'Cart item not found' });
      }
    } catch (error) {
      console.error('Error in removeBook:', error);
      return res.status(500).json('Server error');
    }
  }
}

module.exports = new CartController();