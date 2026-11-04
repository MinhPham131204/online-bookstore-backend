const bookService = require('./services/BookService');

module.exports = {
  getPrices: async (bookIds) => {
    return await bookService.getPrices(bookIds);
  },
};