const { Op, Sequelize } = require("sequelize");
const sequelize = require("../../../shared/database/connection");

const BookModel = require("../models/BookModel");
const BookImageModel = require("../models/BookImageModel");
const CategoryModel = require("../models/CategoryModel");

class BookService {
  async getTopSellingBooksPerCategory() {
    const result = await sequelize.query(
      `
      WITH ValidCategories AS (
        SELECT b.categoryID
        FROM Book b
        JOIN Category c ON c.ID = b.categoryID
        WHERE c.superID IS NOT NULL
        GROUP BY b.categoryID
        HAVING COUNT(*) >= 5
      ),
      RankedBooks AS (
        SELECT 
          b.bookID,
          b.title,
          b.price,
          b.soldAmount,
          b.categoryID,
          img.image,
          ROW_NUMBER() OVER (PARTITION BY b.categoryID ORDER BY b.soldAmount DESC) AS rank
        FROM Book b
        JOIN ValidCategories vc ON vc.categoryID = b.categoryID
        JOIN bookImage img ON b.bookID = img.bookID
        WHERE img.ssn IN (
          SELECT MIN(ssn)
          FROM bookImage
          GROUP BY bookID
        )
      )
      SELECT 
        bookID, 
        title, 
        categoryID, 
        price, 
        image
      FROM RankedBooks
      WHERE rank <= 5
      ORDER BY categoryID, rank; `,
      { type: sequelize.QueryTypes.SELECT },
    );

    return result;
  }

  async getAllBookByCategory(categoryId) {
    const result = await BookModel.findAll({
      attributes: ["bookID", "title", "price"],
      include: [
        {
          model: BookImageModel,
          attributes: ["image"],
          where: {
            ssn: {
              [Op.in]: Sequelize.literal(
                `(SELECT MIN(ssn) FROM bookImage GROUP BY bookID)`,
              ),
            },
          },
        },
      ],
      where: {
        categoryID: categoryId,
      },
      order: [["soldAmount", "DESC"]],
    });

    return result;
  }

  async getBookInfo(bookId) {
    const book = await BookModel.findOne({
      include: [{ model: CategoryModel, attributes: ["superID"] }],
      where: { bookID: bookId },
    });

    if (!book) return null;

    const result = book.get({ plain: true });

    const [images, similarBooks] = await Promise.all([
      this.getBookImages(bookId),
      this.getSimilarBooks(bookId, result.categoryID)
    ]);

    return {
      ...result,
      image: images,
      similarBook: similarBooks,
    };
  }

  async getPrices(bookIds) {
    if (!bookIds || bookIds.length === 0) return [];

    return await BookModel.findAll({
      attributes: ['bookID', 'title', 'price'],
      where: {
        bookID: {
          [Op.in]: bookIds,
        },
      },
      raw: true,
    });
  }

  async getBookImages(bookId) {
    const images = await BookImageModel.findAll({
      attributes: ["image"],
      where: { bookID: bookId },
      raw: true,
    });
    return images.map((e) => e.image);
  }

  async getSimilarBooks(bookId, categoryId) {
    // get top 5 books in the same category, excluding the current book, ordered by soldAmount
    const query = `
    WITH firstImage AS (
      SELECT bookID, image 
      FROM bookImage 
      WHERE ssn IN (SELECT MIN(ssn) FROM bookImage GROUP BY bookID)
    )
    SELECT TOP 5 b.bookID, b.title, b.price, img.image
    FROM Book b
    JOIN firstImage img ON b.bookID = img.bookID
    WHERE b.categoryID = :categoryId AND b.bookID <> :bookId
    ORDER BY b.soldAmount DESC
  `;

    return sequelize.query(query, {
      replacements: { categoryId, bookId },
      type: sequelize.QueryTypes.SELECT,
    });
  }
}

module.exports = new BookService();
