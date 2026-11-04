const BookService = require('../services/BookService');

class BookController {
  // [GET] /books
  async showBooks(req, res) {
    try {
      const books = await BookService.getTopSellingBooksPerCategory();

      if (books && books.length > 0) {
        return res.status(200).json(books);
      } else {
        return res.status(404).json({ error: '404 Not Found' });
      }
    } catch (err) {
      console.error('Error in showBook:', err); 
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // [GET] /books/category/:id
  async showAllBookByCategory (req, res) {
    try {
      const result = await BookService.getAllBookByCategory(req.params.categoryID);

      if(result && result.length){
        res.status(200).json(result)
      }
        else res.status(404).json({error: '404 Not Found'})
    }
    catch (err) {
      console.error('Error in showAllBookByCategory:', err); 
      return res.status(500).json('Server error')
    }
  }

  // [GET] /books/:id
  async showBookInfo(req, res) {
    try {
      const bookId = req.params.id;

      const bookInfo = await BookService.getBookInfo(bookId);

      if (bookInfo) {
        return res.status(200).json(bookInfo);
      }
      else {
        return res.status(404).json({ error: '404 Not Found' });
      }

    } catch (err) {
      console.error('Error in showBookInfo:', err);
      return res.status(500).json('Server error');
    }
  }

}

module.exports = new BookController()