const express = require('express');
const router = express.Router();

const UserController = require('../../modules/user/controllers/userController');
const AuthController = require('../../modules/auth/controllers/authController');
const BookController = require('../../modules/catalog/controllers/BookController');
const OrderController = require('../../modules/orders/controllers/OrderController');
const CartController = require('../../modules/orders/controllers/CartController');

const { requireLogin, verifyToken } = require('../../shared/middlewares/jwtAuth');

// Auth routes
router.post('/users', UserController.register);
router.post('/login', AuthController.login);
router.delete('/logout', AuthController.logout);

// User routes
router.get('/user/info', UserController.showInfo);
router.put('/user/info', UserController.changeInfo);

// Book routes
router.get('/books', BookController.showBooks);
router.get('/books/categories/:id', BookController.showAllBookByCategory);
router.get('/books/:id', BookController.showBookInfo);

// Cart routes
router.post('/cart/items', CartController.addToCart);
router.get('/cart', CartController.getAll);
router.put('/cart/:id', CartController.updateBook);
router.delete('/cart/:id', CartController.removeFromCart);

// Order routes
router.get('/order-info', requireLogin, verifyToken, OrderController.showOrderInfo);
router.post('/order', requireLogin, verifyToken, OrderController.confirmOrder);
router.get('/orders', requireLogin, verifyToken, OrderController.showOrderList);
router.put('/orders/:id', requireLogin, verifyToken, OrderController.cancelOrder);

module.exports = router;